'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const PAGE_SIZE = 20;

export default function AdminDashboard() {
  const { user, loading: authLoading, getFullUserData } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [resPage, setResPage] = useState(0);
  const [userPage, setUserPage] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (!user) return;
    setLoading(true);
    getFullUserData()
      .then(data => {
        if (!mounted) return;
        if (data?.role === 'admin') {
          setIsAdmin(true);
          fetchData();
        } else {
          setIsAdmin(false);
        }
      })
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, [user, getFullUserData]);

  async function fetchData(typeFilter = filterType, dateFilter = filterDate) {
    setLoading(true);
    setError('');
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersMap = {};
      usersSnap.docs.forEach(u => usersMap[u.id] = u.data());
      const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const resSnap = await getDocs(collection(db, 'reservations'));
      let resList = resSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const now = new Date();
      resList = resList.filter(r => {
        const classDate = r.dateTime?.toDate ? r.dateTime.toDate() : null;
        const matchesType = typeFilter ? r.classType === typeFilter : true;
        const matchesDate = dateFilter ? classDate?.toDateString() === new Date(dateFilter).toDateString() : true;
        return r.status === 'active' && classDate && classDate > now && matchesType && matchesDate;
      });

      resList.sort((a, b) => {
        const aDate = a.dateTime?.toDate ? a.dateTime.toDate() : new Date(0);
        const bDate = b.dateTime?.toDate ? b.dateTime.toDate() : new Date(0);
        return aDate - bDate;
      });

      setUsers(allUsers);
      setReservations(resList.map(r => ({
        ...r,
        userName: usersMap[r.userId] ? `${usersMap[r.userId].name || ''} ${usersMap[r.userId].surname || ''}` : r.userId
      })));
      setResPage(0);
      setUserPage(0);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function exportCSV(filename, data, columns) {
    const header = columns.join(',');
    const rows = data.map(row => columns.map(col => {
      const v = row[col];
      if (v == null) return '';
      if (typeof v === 'object' && typeof v.toDate === 'function') return v.toDate().toISOString();
      if (typeof v === 'object') return JSON.stringify(v).replace(/"/g,'""');
      return String(v).replace(/"/g,'""');
    }).map(cell => `"${cell}"`).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const paginatedReservations = reservations.slice(resPage*PAGE_SIZE, (resPage+1)*PAGE_SIZE);
  const paginatedUsers = users.slice(userPage*PAGE_SIZE, (userPage+1)*PAGE_SIZE);

  if (authLoading) return <p className="p-6">Comprobando sesión...</p>;
  if (!user) return <p className="p-6">Debes iniciar sesión para acceder al panel.</p>;
  if (!isAdmin) return <p className="p-6">No tienes permisos para ver esta página.</p>;

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl mb-4" style={{ color: 'rgb(173,173,174)' }}>Panel administrador</h1>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button
          onClick={() => fetchData()}
          className="px-4 py-2 rounded-md"
          style={{ backgroundColor: '#cbc8bf', color: '#fff' }}
        >Refrescar</button>

        <label className="flex items-center gap-2">
          Tipo:
          <select value={filterType} onChange={e => { setFilterType(e.target.value); fetchData(e.target.value, filterDate); }} className="px-2 py-1 border rounded">
            <option value="">Todas</option>
            <option value="pilates">Pilates</option>
            <option value="yoga">Yoga</option>
            <option value="barre">Barre</option>
            <option value="funcional">Funcional</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          Fecha:
          <input type="date" value={filterDate} onChange={e => { setFilterDate(e.target.value); fetchData(filterType, e.target.value); }} className="px-2 py-1 border rounded"/>
        </label>

        <button
          onClick={() => exportCSV('reservations.csv', reservations, ['id','userId','userName','classId','classTitle','classType','status','dateTime','createdAt'])}
          className="px-4 py-2 rounded-md border"
        >Exportar reservas</button>
      </div>

      <p className="mb-2">Reservas activas: {reservations.length} (mostrando {paginatedReservations.length} en página {resPage+1})</p>

      <div className="overflow-auto border rounded mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-white text-left">
              <th className="p-2" style={{width:'80px'}}>Clase</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Creación</th>
              <th className="p-2" style={{width:'120px'}}>ID</th>
              <th className="p-2" style={{width:'120px'}}>UserID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.classTitle || r.classId}</td>
                <td className="p-2">{r.userName}</td>
                <td className="p-2">{r.dateTime?.toDate ? r.dateTime.toDate().toLocaleString() : ''}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ''}</td>
                <td className="p-2 truncate">{r.id}</td>
                <td className="p-2 truncate">{r.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación reservas */}
      <div className="flex gap-2 mb-8">
        <button disabled={resPage===0} onClick={() => setResPage(resPage-1)} className="px-3 py-1 border rounded">Anterior</button>
        <button disabled={(resPage+1)*PAGE_SIZE >= reservations.length} onClick={() => setResPage(resPage+1)} className="px-3 py-1 border rounded">Siguiente</button>
      </div>

      <section>
        <h2 className="text-lg mb-2" style={{ color: 'rgb(173,173,174)' }}>Usuarios ({users.length})</h2>
        <div className="overflow-auto border rounded mb-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white text-left">
                <th className="p-2">Nombre</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2" style={{width:'120px'}}>ID</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{(u.name || '') + ' ' + (u.surname || '')}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role || 'user'}</td>
                  <td className="p-2 truncate">{u.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación usuarios */}
        <div className="flex gap-2 mb-8">
          <button disabled={userPage===0} onClick={() => setUserPage(userPage-1)} className="px-3 py-1 border rounded">Anterior</button>
          <button disabled={(userPage+1)*PAGE_SIZE >= users.length} onClick={() => setUserPage(userPage+1)} className="px-3 py-1 border rounded">Siguiente</button>
        </div>
      </section>
    </div>
  );
}
