'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { StatCard } from './admin/StatCard';
import { AdminTable } from './admin/AdminTable';
import { TypeFilter } from './admin/TypeFilter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";


const PAGE_SIZE = 20;

export default function AdminDashboard() {
  const { user, loading: authLoading, getFullUserData } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  const [resPage, setResPage] = useState(0);
  const [userPage, setUserPage] = useState(0);

    function exportCSV(filename, data, columns) {
    const header = columns.join(',');
    const rows = data.map(row =>
        columns.map(col => {
        const v = row[col];
        if (v == null) return '';
        if (typeof v === 'object' && typeof v.toDate === 'function') return v.toDate().toISOString();
        if (typeof v === 'object') return JSON.stringify(v).replace(/"/g, '""');
        return String(v).replace(/"/g, '""');
        }).map(cell => `"${cell}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    }

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
      // Usuarios
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersMap = {};
      usersSnap.docs.forEach(u => usersMap[u.id] = u.data());
      const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      allUsers.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return bDate - aDate; // descendente
        });

      // Reservas
      const resSnap = await getDocs(collection(db, 'reservations'));
      let resList = resSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const now = new Date();
      const activeReservations = resList.filter(r => r.status === 'active' && r.dateTime?.toDate && r.dateTime.toDate() > now);

      setAllReservations(activeReservations); // guardamos todas las reservas activas

      
      resList = resList.filter(r => {
        const classDate = r.dateTime?.toDate ? r.dateTime.toDate() : null;
        const matchesType = typeFilter === "all" ? true : r.classType === typeFilter;
        const matchesDate = dateFilter ? classDate?.toDateString() === new Date(dateFilter).toDateString() : true;
        return r.status === 'active' && classDate && classDate > now && matchesType && matchesDate;
      });

      resList.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return bDate - aDate;
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

  const paginatedReservations = useMemo(
    () => reservations.slice(resPage * PAGE_SIZE, (resPage + 1) * PAGE_SIZE),
    [reservations, resPage]
  );
  const paginatedUsers = useMemo(
    () => users.slice(userPage * PAGE_SIZE, (userPage + 1) * PAGE_SIZE),
    [users, userPage]
  );

    const duplicateUsers = useMemo(() => {
    const emailMap = {};
    users.forEach(u => {
        if (!emailMap[u.email]) emailMap[u.email] = [];
        emailMap[u.email].push(u);
    });

    return Object.entries(emailMap)
        .filter(([email, uArr]) => uArr.length > 1)
        .map(([email, uArr]) => ({
        email,
        users: uArr.map(u => ({
            uid: u.id,
            name: `${u.name || ''} ${u.surname || ''}`,
            reservations: reservations.filter(r => r.userId === u.id).map(r => r.classTitle || r.id),
            createdAt: u.createdAt
        })),
        }));
    }, [users, reservations]);

    const usersWithoutReservations = useMemo(() => {
    // Map de email → usuarios
    const emailMap = {};
    users.forEach(u => {
        if (!emailMap[u.email]) emailMap[u.email] = [];
        emailMap[u.email].push(u);
    });

    const reservedUserIds = new Set(allReservations.map(r => r.userId));

    const result = [];

    Object.values(emailMap).forEach(userGroup => {
        // Ver si alguno tiene reserva
        const hasReservation = userGroup.some(u => reservedUserIds.has(u.id));

        if (!hasReservation) {
        // ninguno tiene reserva → contamos solo uno
        const u = userGroup[0];
        result.push({
            uid: u.id,
            name: `${u.name || ''} ${u.surname || ''}`,
            email: u.email,
            createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '',
        });
        }
        // si alguno tiene reserva → no contamos ninguno
    });

    return result;
    }, [users, allReservations]);


  if (authLoading) return <p className="p-6">Comprobando sesión...</p>;
  if (!user) return <p className="p-6">Debes iniciar sesión para acceder al panel.</p>;
  if (!isAdmin) return <p className="p-6">No tienes permisos para ver esta página.</p>;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">Panel administrador</h1>

      {/* Estadísticas rápidas */}
      <div className="flex flex-wrap gap-4">
        <StatCard title="Usuarios registrados" value={users.length} />
        <StatCard title="Reservas activas" value={reservations.length} />
        <StatCard title="Usuarios sin reservas" value={usersWithoutReservations.length} />
      </div>

      {/* Filtros y acciones */}
      <div className="flex flex-wrap items-center gap-4">
        <TypeFilter value={filterType} onChange={val => { setFilterType(val); fetchData(val, filterDate); }} />
        <input
          type="date"
          value={filterDate}
          onChange={e => { setFilterDate(e.target.value); fetchData(filterType, e.target.value); }}
          className="px-3 py-2 border rounded"
        />
        <Button onClick={() => fetchData()}>Refrescar</Button>
      </div>

      {/* Tabla de reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTable
            columns={[
              { key: 'classTitle', label: 'Clase' },
              { key: 'userName', label: 'Nombre' },
              { key: 'dateTime', label: 'Fecha' },
              { key: 'createdAt', label: 'Reservado' },
              { key: 'status', label: 'Estado' },
              { key: 'id', label: 'ID' },
              { key: 'userId', label: 'UserID' },
            ]}
            data={paginatedReservations.map(r => ({
              ...r,
              dateTime: r.dateTime?.toDate ? r.dateTime.toDate().toLocaleString() : '',
              createdAt: r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : '',
            }))}
          />
          <div className="flex gap-2 mt-2">
            <Button disabled={resPage===0} onClick={() => setResPage(resPage-1)}>Anterior</Button>
            <Button disabled={(resPage+1)*PAGE_SIZE >= reservations.length} onClick={() => setResPage(resPage+1)}>Siguiente</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTable
            columns={[
              { key: 'name', label: 'Nombre' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Rol' },
              { key: 'id', label: 'ID' },
              { key: 'createdAt', label: 'Creado'}
            ]}
            data={paginatedUsers.map(u => ({
              ...u,
              name: (u.name || '') + ' ' + (u.surname || ''),
              role: u.role || 'user',
              createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '',
            }))}
          />
          <div className="flex gap-2 mt-2">
            <Button disabled={userPage===0} onClick={() => setUserPage(userPage-1)}>Anterior</Button>
            <Button disabled={(userPage+1)*PAGE_SIZE >= users.length} onClick={() => setUserPage(userPage+1)}>Siguiente</Button>
          </div>
        </CardContent>
      </Card>

         {/* Tabla de usuarios sin reserva */}
      {usersWithoutReservations.length > 0 && (
        <Card>
            <CardHeader>
            <CardTitle>Usuarios sin reservas:  ({usersWithoutReservations.length})
</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <AdminTable
                columns={[
                { key: 'name', label: 'Nombre' },
                { key: 'email', label: 'Email' },
                { key: 'createdAt', label: 'Creado' },
                { key: 'uid', label: 'UID' },
                ]}
                data={usersWithoutReservations.map(u => ({
                ...u,
                createdAt: u.createdAt?.toDate
                    ? u.createdAt.toDate().toLocaleString()
                    : u.createdAt instanceof Date
                    ? u.createdAt.toLocaleString()
                    : u.createdAt || '',
                }))}
            />
                <div className="flex gap-2 mt-2">
                    <Button
                        onClick={() =>
                        exportCSV(
                            'usuarios_sin_reservas.csv',
                            usersWithoutReservations.map(u => ({
                            name: u.name,
                            email: u.email,
                            uid: u.uid,
                            createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '',
                            })),
                            ['name', 'email', 'uid', 'createdAt']
                        )
                        }
                    >
                        Exportar CSV
                    </Button>
                </div>
            </CardContent>
        </Card>
        )}

        {/* Tabla de usuarios duplicados */}
        {duplicateUsers.length > 0 && (
        <Card>
            <CardHeader>
            <CardTitle>Usuarios duplicados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            {duplicateUsers.map((dup, i) => (
                <div key={i}>
                <p className="font-bold mb-2">Email duplicado: {dup.email}</p>
                <AdminTable
                    columns={[
                    { key: 'uid', label: 'UID' },
                    { key: 'name', label: 'Nombre' },
                    { key: 'reservations', label: 'Reservas' },
                    { key: 'createdAt', label: 'Creado'}
                    ]}
                    data={dup.users.map(u => ({
                    ...u,
                    reservations: u.reservations.join(', ') || 'Sin reservas',
                    createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '',
                    }))}
                />
                </div>
            ))}
            </CardContent>
        </Card>
        )}
    </div>
  );
}
