'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { StatCard } from './admin/StatCard';
import { AdminTable } from './admin/AdminTable';
import { TypeFilter } from './admin/TypeFilter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";


const PAGE_SIZE = 20;

export default function AdminDashboard() {
  const { user, loading: authLoading, getFullUserData } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

    const [resPage, setResPage] = useState(0);
    const [userPage, setUserPage] = useState(0);
    const [classPage, setClassPage] = useState(0);

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

  // Reemplaza toda tu función fetchData por esta:
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
                    return bDate - aDate;
                });

                // Clases - usar SIEMPRE los parámetros
                const classesSnap = await getDocs(collection(db, "classes"));
                let allClasses = classesSnap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                }));

                allClasses = allClasses.filter(c => {
                    const matchesType = typeFilter === "all" ? true : c.type === typeFilter;
                    const matchesDate = dateFilter
                        ? c.dateTime?.toDate?.().toDateString() === new Date(dateFilter).toDateString()
                        : true;
                    return matchesType && matchesDate;
                });

                // Calcular capacityLeft
                allClasses = allClasses.map(c => ({
                    ...c,
                    capacityLeft: (c.capacity || 0) - (c.atendees?.length || 0)
                }));

                allClasses.sort((a, b) => {
                    const aDate = a.dateTime?.toDate ? a.dateTime.toDate() : new Date(0);
                    const bDate = b.dateTime?.toDate ? b.dateTime.toDate() : new Date(0);
                    return aDate - bDate;
                });
                setClasses(allClasses);

                // Reservas - usar SIEMPRE los parámetros
                const resSnap = await getDocs(collection(db, 'reservations'));
                let resList = resSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                const now = new Date();
                const activeReservations = resList.filter(r => r.status === 'active' && r.dateTime?.toDate && r.dateTime.toDate() > now);
                setAllReservations(activeReservations);

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
                setUsersMap(usersSnap.docs.reduce((acc, u) => {
                    acc[u.id] = u.data();
                    return acc;
                }, {}));

                setReservations(resList.map(r => ({
                    ...r,
                    userName: usersMap[r.userId] ? `${usersMap[r.userId].name || ''} ${usersMap[r.userId].surname || ''}` : r.userId
                })));
                
                setResPage(0);
                setUserPage(0);
                setClassPage(0);
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

    const paginatedClasses = useMemo(
        () => classes.slice(classPage * PAGE_SIZE, (classPage + 1) * PAGE_SIZE),
        [classes, classPage]
    );


    const selectedReservations = useMemo(() => {
        if (!selectedClass) return [];
            return reservations.filter(r => r.classId === selectedClass.id);
    }, [selectedClass, reservations]);

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

    const selectedClassAttendees = useMemo(() => {
        if (!selectedClass) return [];
            return (selectedClass.atendees || []).map(uid => {
                const u = usersMap[uid]; // <-- ahora usamos el map completo
                return {
                uid,
                name: u ? `${u.name || ""} ${u.surname || ""}` : "(desconocido)",
                email: u?.email || "",
                };
            });
    }, [selectedClass, usersMap]);

        // Resrevation attendees
        const reservationAttendees = useMemo(() => {
            if (!selectedReservation) return [];
            const classObj = classes.find(c => c.id === selectedReservation.classId);
            if (!classObj || !classObj.atendees) return [];

            return classObj.atendees.map(uid => {
                const u = usersMap[uid];
                return {
                uid,
                name: u ? `${u.name || ""} ${u.surname || ""}` : `(desconocido - ${uid})`,
                email: u?.email || "Sin email",
                };
            });
        }, [selectedReservation, classes, usersMap]);

            // Reservas de un usuario
            const userReservations = useMemo(() => {
                if (!selectedUser) return [];
                // Filtramos todas las reservas del usuario
                const res = reservations.filter(r => r.userId === selectedUser.id);

                // Map a la info que queremos mostrar
                return res.map(r => {
                    const classObj = classes.find(c => c.id === r.classId);
                    return {
                    id: r.id,
                    classTitle: classObj?.title || "(desconocido)",
                    dateTime: classObj?.dateTime?.toDate
                        ? classObj.dateTime.toDate().toLocaleString()
                        : "",
                    monitor: classObj?.monitor || "(desconocido)",
                    };
                });
            }, [selectedUser, reservations, classes]);




  if (authLoading) return <p className="p-6">Comprobando sesión...</p>;
  if (!user) return <p className="p-6">Debes iniciar sesión para acceder al panel.</p>;
  if (!isAdmin) return <p className="p-6">No tienes permisos para ver esta página.</p>;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">Panel administrador</h1>

      {/* Estadísticas rápidas */}
      <div className="flex gap-4 items-stretch">
        <StatCard title="Usuarios totales" value={users.length} />
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
      <Tabs>
            <TabsList>
                <TabsTrigger value="reservas">Reservas</TabsTrigger>
                <TabsTrigger value="clases">Clases</TabsTrigger>
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            </TabsList>
              <TabsContent value="reservas">
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
                    onRowClick={(row) => setSelectedReservation(row)}
                />
                <div className="flex gap-2 mt-2">
                    <Button disabled={resPage===0} onClick={() => setResPage(resPage-1)}>Anterior</Button>
                    <Button disabled={(resPage+1)*PAGE_SIZE >= reservations.length} onClick={() => setResPage(resPage+1)}>Siguiente</Button>
                </div>

                {selectedReservation && (
                    <Dialog open={true} onOpenChange={() => setSelectedReservation(null)}>
                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Asistentes - {selectedReservation.classTitle}</DialogTitle>
                            <DialogDescription>
                            {reservationAttendees.length > 0
                                ? `${reservationAttendees.length} asistentes`
                                : 'No hay asistentes registrados'}
                            </DialogDescription>
                        </DialogHeader>

                        <AdminTable
                            columns={[
                            { key: "name", label: "Nombre" },
                            { key: "email", label: "Email" },
                            { key: "uid", label: "UID" },
                            ]}
                            data={reservationAttendees}
                        />

                        <DialogFooter>
                            <Button onClick={() => setSelectedReservation(null)}>Cerrar</Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    )}

            </TabsContent>

            {/* Tabla de clases */}
            <TabsContent value="clases">
                <AdminTable
                columns={[
                    { key: "title", label: "Clase" },
                    { key: "dateTime", label: "Fecha" },
                    { key: "monitor", label: "Profesor" },
                    { key: "capacity", label: "Capacidad" },
                    { key: "capacityLeft", label: "Plazas libres" },
                ]}
                data={paginatedClasses}
                onRowClick={(row) => setSelectedClass(row)}
            />
                <div className="flex gap-2 mt-2">
                    <Button disabled={classPage===0} onClick={() => setClassPage(classPage-1)}>Anterior</Button>
                    <Button disabled={(classPage+1)*PAGE_SIZE >= reservations.length} onClick={() => setClassPage(classPage+1)}>Siguiente</Button>
                </div>
            
                {/*Dialog al abrir la clase*/}
                {selectedClass && (
                <Dialog open={true} onOpenChange={() => setSelectedClass(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Asistentes - {selectedClass.title}</DialogTitle>
                            <DialogDescription>
                                {selectedClass.atendees && selectedClass.atendees.length > 0 
                                    ? `${selectedClass.atendees.length} asistentes` 
                                    : 'No hay asistentes registrados'}
                            </DialogDescription>
                        </DialogHeader>
                        <AdminTable
                            columns={[
                                { key: "name", label: "Nombre" },
                                { key: "email", label: "Email" },
                                { key: "uid", label: "UID" },
                            ]}
                            data={(selectedClass.atendees || []).map(uid => {
                                const u = usersMap[uid];
                                return {
                                    uid,
                                    name: u ? `${u.name || ""} ${u.surname || ""}` : `(desconocido - ${uid})`,
                                    email: u?.email || "Sin email",
                                };
                            })}
                        />
                        <DialogFooter>
                            <Button onClick={() => setSelectedClass(null)}>Cerrar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                )}
            </TabsContent>



      {/* Tabla de usuarios */}
            <TabsContent value="usuarios">
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
                    onRowClick={(row) => setSelectedUser(row)}
                />
                <div className="flex gap-2 mt-2">
                    <Button disabled={userPage===0} onClick={() => setUserPage(userPage-1)}>Anterior</Button>
                    <Button disabled={(userPage+1)*PAGE_SIZE >= users.length} onClick={() => setUserPage(userPage+1)}>Siguiente</Button>
                </div>

                    {selectedUser && (
                        <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
                            <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reservas de {selectedUser.name || selectedUser.email} </DialogTitle>
                                <DialogDescription>
                                {userReservations.length > 0
                                    ? `${userReservations.length} reservas`
                                    : 'No tiene reservas'}
                                </DialogDescription>
                            </DialogHeader>

                            <AdminTable
                                columns={[
                                { key: 'classTitle', label: 'Clase' },
                                { key: 'dateTime', label: 'Día' },
                                { key: 'monitor', label: 'Profesor' },
                                ]}
                                data={userReservations}
                            />

                            <DialogFooter>
                                <Button onClick={() => setSelectedUser(null)}>Cerrar</Button>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        )}

                </TabsContent>
        </Tabs>

                        {/* Tabla de usuarios sin reserva */}
                    <Accordion type="single" collapsible>
                        {usersWithoutReservations.length > 0 && (
                            <AccordionItem value="usersWithoutReservations">
                            <AccordionTrigger>
                                Usuarios sin reservas ({usersWithoutReservations.length})
                            </AccordionTrigger>
                            <AccordionContent>
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
                                        createdAt: u.createdAt?.toDate
                                            ? u.createdAt.toDate().toLocaleString()
                                            : '',
                                        })),
                                        ['name', 'email', 'uid', 'createdAt']
                                    )
                                    }
                                >
                                    Exportar CSV
                                </Button>
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        )}

                        {duplicateUsers.length > 0 && (
                            <AccordionItem value="duplicatedUsers">
                            <AccordionTrigger>Usuarios Duplicados</AccordionTrigger>
                            <AccordionContent>
                                {duplicateUsers.map((dup, i) => (
                                <div key={i}>
                                    <p className="font-bold mb-2">Email duplicado: {dup.email}</p>
                                    <AdminTable
                                    columns={[
                                        { key: 'uid', label: 'UID' },
                                        { key: 'name', label: 'Nombre' },
                                        { key: 'reservations', label: 'Reservas' },
                                        { key: 'createdAt', label: 'Creado' },
                                    ]}
                                    data={dup.users.map(u => ({
                                        ...u,
                                        reservations: u.reservations.join(', ') || 'Sin reservas',
                                        createdAt: u.createdAt?.toDate
                                        ? u.createdAt.toDate().toLocaleString()
                                        : '',
                                    }))}
                                    />
                                </div>
                                ))}
                            </AccordionContent>
                            </AccordionItem>
                     )}
            </Accordion>
    </div>

    
  );
}
