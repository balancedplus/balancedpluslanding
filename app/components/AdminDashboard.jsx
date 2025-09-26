'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { db } from '../../lib/firebase';
import { makeReservation } from '../../lib/reservations';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { StatCard } from './admin/StatCard';
import { AdminTable } from './admin/AdminTable';
import { TypeFilter } from './admin/TypeFilter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 20;

// Función auxiliar para determinar el tipo de usuario
function getUserType(user) {
  const hasActiveSubscription = user.subscription && 
    (user.subscription.status === 'active' || user.subscription.status === 'trialing');
  const hasCredits = user.hasClassCredits === true && (user.classCredits || 0) > 0;
  
  if (hasActiveSubscription) {
    return {
      type: 'subscription',
      label: 'Suscripción',
      status: user.subscription.status,
      details: user.subscription.planType || 'Plan desconocido'
    };
  } else if (hasCredits) {
    return {
      type: 'credits',
      label: 'Créditos',
      status: 'active',
      details: `${user.classCredits} crédito${user.classCredits !== 1 ? 's' : ''}`
    };
  } else {
    return {
      type: 'none',
      label: 'Sin acceso',
      status: 'inactive',
      details: 'Sin suscripción ni créditos'
    };
  }
}

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
  
  // Filtros para usuarios
  const [userNameFilter, setUserNameFilter] = useState('');
  const [userEmailFilter, setUserEmailFilter] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [reservationTypeFilter, setReservationTypeFilter] = useState('all');

  // Estados para edición
  const [editingUser, setEditingUser] = useState(null);
  const [editingReservationType, setEditingReservationType] = useState('');
  const [savingChanges, setSavingChanges] = useState(false);

  const [resPage, setResPage] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [classPage, setClassPage] = useState(0);

  const [configuringScheduleUser, setConfiguringScheduleUser] = useState(null);
  const [fixedSchedule, setFixedSchedule] = useState([]);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [processingUser, setProcessingUser] = useState(null);

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

  // Función para actualizar el tipo de reserva del usuario
  const updateUserReservationType = async (userId, newReservationType) => {
    setSavingChanges(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'subscription.reservationType': newReservationType,
        updatedAt: serverTimestamp()
      });
      
      // Actualizar usuario local
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, subscription: { ...u.subscription, reservationType: newReservationType }}
          : u
      ));
      
      setEditingUser(null);
      console.log('Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error al actualizar el usuario');
    } finally {
      setSavingChanges(false);
    }
  };

  // 2. FUNCIÓN PARA GUARDAR HORARIO FIJO
const saveFixedSchedule = async (userId, scheduleArray) => {
  setSavingSchedule(true);
  try {
    const userRef = doc(db, 'users', userId);
    
    // Si el array está vacío, cambiar a flex
    const newReservationType = scheduleArray.length > 0 ? 'fixed' : 'flex';
    
    await updateDoc(userRef, {
      'subscription.fixedSchedule': scheduleArray,
      'subscription.reservationType': newReservationType,
      updatedAt: serverTimestamp()
    });
    
    // Actualizar estado local
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { 
            ...u, 
            subscription: { 
              ...u.subscription, 
              fixedSchedule: scheduleArray,
              reservationType: newReservationType
            }
          }
        : u
    ));
    
    setConfiguringScheduleUser(null);
    setFixedSchedule([]);
    console.log('Horario fijo guardado correctamente');
  } catch (error) {
    console.error('Error guardando horario:', error);
    setError('Error al guardar el horario fijo');
  } finally {
    setSavingSchedule(false);
  }
};

const openScheduleConfig = (user) => {
  setConfiguringScheduleUser(user);
  // Cargar horario existente o crear uno vacío
  setFixedSchedule(user.subscription?.fixedSchedule || []);
};

const addScheduleSlot = () => {
  setFixedSchedule(prev => [...prev, {
    classType: 'pilates',
    dayOfWeek: 1, // lunes por defecto
    time: '09:00',
    autoReserve: true
  }]);
};

const removeScheduleSlot = (index) => {
  setFixedSchedule(prev => prev.filter((_, i) => i !== index));
};

const updateScheduleSlot = (index, field, value) => {
  setFixedSchedule(prev => prev.map((slot, i) => 
    i === index ? { ...slot, [field]: value } : slot
  ));
};

const getDayName = (dayOfWeek) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayOfWeek];
};

const processUserFixedReservations = async (user) => {
  setProcessingUser(user.id);
  
  try {
    const startDate = new Date('2025-09-29');
    const endDate = new Date('2025-10-31');
    
    let successful = 0;
    let failed = 0;
    const details = [];
    
    console.log('=== INICIANDO PROCESAMIENTO ===');
    console.log('Usuario:', user.name);
    console.log('Horario fijo:', user.subscription.fixedSchedule);
    console.log('Clases disponibles:', classes.length);
    
    // Procesar cada día del período
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      const scheduledClasses = user.subscription.fixedSchedule.filter(
        s => s.dayOfWeek === dayOfWeek && s.autoReserve
      );
      
      console.log(`\n--- Procesando ${currentDate.toDateString()} (día ${dayOfWeek}) ---`);
      console.log('Clases programadas para este día:', scheduledClasses);
      
      for (const schedule of scheduledClasses) {
        try {
          console.log(`\nBuscando clase: ${schedule.classType} a las ${schedule.time}`);
          
          // Buscar clase que coincida
          const matchingClass = classes.find(c => {
            const classDate = c.dateTime?.toDate ? c.dateTime.toDate() : new Date(c.dateTime);
            
            // Comparar fecha (año, mes, día)
            const isSameDay = classDate.getFullYear() === currentDate.getFullYear() &&
                             classDate.getMonth() === currentDate.getMonth() &&
                             classDate.getDate() === currentDate.getDate();
            
            // Comparar hora (formato HH:MM)
            const classTimeFormatted = String(classDate.getHours()).padStart(2, '0') + ':' + 
                                     String(classDate.getMinutes()).padStart(2, '0');
            
            // Comparar tipo de clase
            const isSameType = c.type === schedule.classType;
            
            console.log('Evaluando clase:', c.title);
            console.log('  - Fecha clase:', classDate.toLocaleString());
            console.log('  - Fecha objetivo:', currentDate.toDateString());
            console.log('  - Mismo día?', isSameDay);
            console.log('  - Hora clase:', classTimeFormatted);
            console.log('  - Hora objetivo:', schedule.time);
            console.log('  - Misma hora?', classTimeFormatted === schedule.time);
            console.log('  - Tipo clase:', c.type);
            console.log('  - Tipo objetivo:', schedule.classType);
            console.log('  - Mismo tipo?', isSameType);
            console.log('  - Capacidad restante:', c.capacityLeft);
            
            return isSameType && isSameDay && classTimeFormatted === schedule.time;
          });
          
          if (matchingClass) {
            console.log('✅ Clase encontrada:', matchingClass.title);
            console.log('  - ID de clase:', matchingClass.id);
            console.log('  - Capacidad total:', matchingClass.capacity);
            console.log('  - Asistentes actuales:', matchingClass.atendees?.length || 0);
            console.log('  - Capacidad calculada:', matchingClass.capacityLeft);
            
            // Recalcular capacidad para asegurar que es correcta
            const realCapacityLeft = (matchingClass.capacity || 0) - (matchingClass.atendees?.length || 0);
            console.log('  - Capacidad real:', realCapacityLeft);
            
            // Verificar si ya tiene reserva para esta clase
            const existingReservation = reservations.find(r => 
              r.userId === user.id && 
              r.classId === matchingClass.id && 
              r.status === 'active'
            );
            
            if (existingReservation) {
              console.log('⚠️ Ya tiene reserva para esta clase');
              details.push(`${currentDate.toDateString()} - ${schedule.classType} ${schedule.time}: ya tiene reserva`);
              continue;
            }
            
            // Verificar si el usuario ya está en la lista de asistentes
            const alreadyAttending = matchingClass.atendees?.includes(user.id);
            if (alreadyAttending) {
              console.log('⚠️ Usuario ya está en lista de asistentes');
              details.push(`${currentDate.toDateString()} - ${schedule.classType} ${schedule.time}: ya está inscrito`);
              continue;
            }
            
            if (realCapacityLeft > 0) {
              console.log('🎯 Intentando hacer reserva...');
              console.log('  - Usuario ID:', user.id);
              console.log('  - Usuario email:', user.email);
              
              try {
                await makeReservation({ 
                  user: { uid: user.id, email: user.email }, 
                  cls: { 
                    ...matchingClass,
                    capacityLeft: realCapacityLeft 
                  }
                });
                successful++;
                console.log('✅ Reserva exitosa');
              } catch (reservationError) {
                failed++;
                console.log('❌ Error en makeReservation:', reservationError.message);
                details.push(`${currentDate.toDateString()} - ${schedule.classType} ${schedule.time}: ${reservationError.message}`);
              }
            } else {
              failed++;
              console.log('❌ Clase completa (capacidad real:', realCapacityLeft, ')');
              details.push(`${currentDate.toDateString()} - ${schedule.classType} ${schedule.time}: clase completa`);
            }
          } else {
            failed++;
            console.log('❌ Clase no encontrada');
            details.push(`${currentDate.toDateString()} - ${schedule.classType} ${schedule.time}: clase no encontrada`);
            
            // Debug: mostrar todas las clases de ese día para ayudar a entender por qué no coincide
            const classesOnThatDay = classes.filter(c => {
              const classDate = c.dateTime?.toDate ? c.dateTime.toDate() : new Date(c.dateTime);
              return classDate.getFullYear() === currentDate.getFullYear() &&
                     classDate.getMonth() === currentDate.getMonth() &&
                     classDate.getDate() === currentDate.getDate();
            });
            
            console.log('Clases disponibles ese día:', classesOnThatDay.map(c => ({
              title: c.title,
              type: c.type,
              time: c.dateTime?.toDate ? c.dateTime.toDate().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) : 'Sin hora',
              capacity: c.capacityLeft
            })));
          }
        } catch (error) {
          failed++;
          console.log('❌ Error en reserva:', error.message);
          details.push(`${currentDate.toDateString()} - ${schedule.classType} ${schedule.time}: ${error.message}`);
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log('=== RESUMEN FINAL ===');
    console.log('Exitosas:', successful);
    console.log('Fallidas:', failed);
    console.log('Detalles de errores:', details);
    
    alert(`Usuario ${user.name}: ${successful} reservas exitosas, ${failed} fallidas`);
    if (failed > 0) {
      console.log('Detalles de errores:', details);
    }
    await fetchData(); // Refrescar datos
    
  } catch (error) {
    console.error('Error general:', error);
    alert(`Error procesando usuario ${user.name}: ${error.message}`);
  } finally {
    setProcessingUser(null);
  }
};




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
            return bDate - aDate;
        });

        // Clases
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

        // Reservas
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

  // Estadísticas de usuarios por tipo
  const userStats = useMemo(() => {
    const stats = {
      total: users.length,
      subscription: 0,
      credits: 0,
      none: 0
    };

    users.forEach(user => {
      const userType = getUserType(user);
      stats[userType.type]++;
    });

    return stats;
  }, [users]);

  // Usuarios filtrados
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtro por nombre
      const fullName = `${user.name || ''} ${user.surname || ''}`.toLowerCase();
      const nameMatch = !userNameFilter || fullName.includes(userNameFilter.toLowerCase());
      
      // Filtro por email
      const emailMatch = !userEmailFilter || (user.email || '').toLowerCase().includes(userEmailFilter.toLowerCase());
      
      // Filtro por tipo de suscripción
      const userType = getUserType(user);
      const subscriptionMatch = subscriptionFilter === 'all' || userType.type === subscriptionFilter;
      
      // Filtro por tipo de reserva
      const reservationType = user.subscription?.reservationType || 'flex';
      const reservationMatch = reservationTypeFilter === 'all' || reservationType === reservationTypeFilter;
      
      return nameMatch && emailMatch && subscriptionMatch && reservationMatch;
    });
  }, [users, userNameFilter, userEmailFilter, subscriptionFilter, reservationTypeFilter]);

  const paginatedReservations = useMemo(
      () => reservations.slice(resPage * PAGE_SIZE, (resPage + 1) * PAGE_SIZE),
      [reservations, resPage]
  );
  
  const paginatedUsers = useMemo(
      () => filteredUsers.slice(userPage * PAGE_SIZE, (userPage + 1) * PAGE_SIZE),
      [filteredUsers, userPage]
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
  const emailMap = {};
  users.forEach(u => {
      if (!emailMap[u.email]) emailMap[u.email] = [];
      emailMap[u.email].push(u);
  });

  const reservedUserIds = new Set(allReservations.map(r => r.userId));
  const result = [];

  Object.values(emailMap).forEach(userGroup => {
      const hasReservation = userGroup.some(u => reservedUserIds.has(u.id));
      if (!hasReservation) {
      const u = userGroup[0];
      result.push({
          uid: u.id,
          name: `${u.name || ''} ${u.surname || ''}`,
          email: u.email,
          createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '',
      });
      }
  });

  return result;
  }, [users, allReservations]);

  const selectedClassAttendees = useMemo(() => {
      if (!selectedClass) return [];
          return (selectedClass.atendees || []).map(uid => {
              const u = usersMap[uid];
              return {
              uid,
              name: u ? `${u.name || ""} ${u.surname || ""}` : "(desconocido)",
              email: u?.email || "",
              };
          });
  }, [selectedClass, usersMap]);

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

  const userReservations = useMemo(() => {
      if (!selectedUser) return [];
      const res = reservations.filter(r => r.userId === selectedUser.id);

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

  // Función para limpiar filtros de usuarios
  const clearUserFilters = () => {
    setUserNameFilter('');
    setUserEmailFilter('');
    setSubscriptionFilter('all');
    setReservationTypeFilter('all');
    setUserPage(0);
  };

  if (authLoading) return <p className="p-6">Comprobando sesión...</p>;
  if (!user) return <p className="p-6">Debes iniciar sesión para acceder al panel.</p>;
  if (!isAdmin) return <p className="p-6">No tienes permisos para ver esta página.</p>;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">Panel administrador</h1>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Usuarios totales" value={userStats.total} />
        <StatCard 
          title="Con suscripción" 
          value={userStats.subscription} 
          subtitle={`${((userStats.subscription / userStats.total) * 100).toFixed(1)}%`} 
        />
        <StatCard 
          title="Con créditos" 
          value={userStats.credits}
          subtitle={`${((userStats.credits / userStats.total) * 100).toFixed(1)}%`}
        />
        <StatCard 
          title="Sin acceso" 
          value={userStats.none}
          subtitle={`${((userStats.none / userStats.total) * 100).toFixed(1)}%`}
        />
        <StatCard title="Reservas activas" value={reservations.length} />
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
                    <Button disabled={(classPage+1)*PAGE_SIZE >= classes.length} onClick={() => setClassPage(classPage+1)}>Siguiente</Button>
                </div>
            
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

            <TabsContent value="usuarios">
                {/* Filtros de usuarios */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4 mb-6">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium mb-1">Buscar por nombre</label>
                      <Input
                        placeholder="Nombre o apellido..."
                        value={userNameFilter}
                        onChange={(e) => {
                          setUserNameFilter(e.target.value);
                          setUserPage(0);
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium mb-1">Buscar por email</label>
                      <Input
                        placeholder="correo@ejemplo.com"
                        value={userEmailFilter}
                        onChange={(e) => {
                          setUserEmailFilter(e.target.value);
                          setUserPage(0);
                        }}
                      />
                    </div>
                    
                    <div className="min-w-[180px]">
                      <label className="block text-sm font-medium mb-1">Tipo de usuario</label>
                      <Select
                        value={subscriptionFilter}
                        onValueChange={(value) => {
                          setSubscriptionFilter(value);
                          setUserPage(0);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="subscription">Con suscripción</SelectItem>
                          <SelectItem value="credits">Con créditos</SelectItem>
                          <SelectItem value="none">Sin acceso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-[180px]">
                      <label className="block text-sm font-medium mb-1">Tipo de reserva</label>
                      <Select
                        value={reservationTypeFilter}
                        onValueChange={(value) => {
                          setReservationTypeFilter(value);
                          setUserPage(0);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="flex">Flexible</SelectItem>
                          <SelectItem value="fixed">Horario fijo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button variant="outline" onClick={clearUserFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Mostrando {filteredUsers.length} de {users.length} usuarios
                  </div>
                </div>

                <AdminTable
                    columns={[
                        { key: 'name', label: 'Nombre' },
                        { key: 'email', label: 'Email' },
                        { key: 'userType', label: 'Tipo' },
                        { key: 'reservationType', label: 'Modalidad' },
                        { key: 'userDetails', label: 'Detalles' },
                        { key: 'role', label: 'Rol' },
                        { key: 'createdAt', label: 'Creado'},
                        { key: 'actions', label: 'Acciones' }
                    ]}
                    data={paginatedUsers.map(u => {
                      const userType = getUserType(u);
                      const hasSubscription = u.subscription && 
                        (u.subscription.status === 'active' || u.subscription.status === 'trialing');
                      
                      return {
                        ...u,
                        name: (u.name || '') + ' ' + (u.surname || ''),
                        role: u.role || 'user',
                        userType: userType.label,
                        reservationType: hasSubscription 
                          ? (u.subscription?.reservationType || 'flex')
                          : 'N/A',
                        userDetails: userType.details,
                        createdAt: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '',
                        actions: hasSubscription ? (
                        <div className="flex gap-1">
                            <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingUser(u);
                                setEditingReservationType(u.subscription?.reservationType || 'flex');
                            }}
                            >
                            {u.subscription?.reservationType || 'flex'}
                            </Button>
                            <Button 
                            size="sm" 
                            variant={u.subscription?.fixedSchedule?.length > 0 ? "default" : "secondary"}
                            onClick={(e) => {
                                e.stopPropagation();
                                openScheduleConfig(u);
                            }}
                            >
                            {u.subscription?.fixedSchedule?.length > 0 ? 'Horario' : 'Config'}
                            </Button>
                            {u.subscription?.reservationType === 'fixed' && u.subscription?.fixedSchedule?.length > 0 && (
                            <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={(e) => {
                                e.stopPropagation();
                                processUserFixedReservations(u);
                                }}
                                disabled={processingUser === u.id}
                            >
                                {processingUser === u.id ? '...' : 'Reservar'}
                            </Button>
                            )}
                        </div>
                        ) : null
                                            };
                    })}
                    onRowClick={(row) => setSelectedUser(row)}
                />
                <div className="flex gap-2 mt-2">
                    <Button disabled={userPage===0} onClick={() => setUserPage(userPage-1)}>Anterior</Button>
                    <Button disabled={(userPage+1)*PAGE_SIZE >= filteredUsers.length} onClick={() => setUserPage(userPage+1)}>Siguiente</Button>
                </div>

                {selectedUser && (
                    <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
                        <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Detalles de {selectedUser.name || selectedUser.email}</DialogTitle>
                            <DialogDescription>
                              Información completa del usuario y sus reservas
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Información del usuario</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div><strong>Email:</strong> {selectedUser.email}</div>
                              <div><strong>Teléfono:</strong> {selectedUser.phoneNumber || 'No disponible'}</div>
                              <div><strong>Tipo:</strong> {getUserType(selectedUser).label}</div>
                              <div><strong>Estado:</strong> {getUserType(selectedUser).details}</div>
                              {selectedUser.subscription && (
                                <>
                                  <div><strong>Plan:</strong> {selectedUser.subscription.planType}</div>
                                  <div><strong>Estado suscripción:</strong> {selectedUser.subscription.status}</div>
                                  <div><strong>Modalidad:</strong> {selectedUser.subscription.reservationType || 'flex'}</div>
                                </>
                              )}
                              {selectedUser.classCredits && (
                                <div><strong>Créditos:</strong> {selectedUser.classCredits}</div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">
                              Reservas ({userReservations.length})
                            </h4>
                            {userReservations.length > 0 ? (
                              <AdminTable
                                  columns={[
                                  { key: 'classTitle', label: 'Clase' },
                                  { key: 'dateTime', label: 'Día' },
                                  { key: 'monitor', label: 'Profesor' },
                                  ]}
                                  data={userReservations}
                              />
                            ) : (
                              <p className="text-gray-500 text-sm">No tiene reservas activas</p>
                            )}
                          </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setSelectedUser(null)}>Cerrar</Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Modal para editar tipo de reserva */}
                {editingUser && (
                  <Dialog open={true} onOpenChange={() => setEditingUser(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Editar modalidad de {editingUser.name || editingUser.email}
                        </DialogTitle>
                        <DialogDescription>
                          Cambiar entre reservas flexibles y horario fijo
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tipo de reserva
                          </label>
                          <Select
                            value={editingReservationType}
                            onValueChange={setEditingReservationType}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flex">
                                Flexible - El usuario reserva manualmente
                              </SelectItem>
                              <SelectItem value="fixed">
                                Horario fijo - Reservas automáticas
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p><strong>Flexible:</strong> El usuario debe reservar cada clase manualmente.</p>
                          <p><strong>Horario fijo:</strong> Se reservan automáticamente las mismas clases cada semana.</p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingUser(null)}
                          disabled={savingChanges}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={() => updateUserReservationType(editingUser.id, editingReservationType)}
                          disabled={savingChanges || editingReservationType === (editingUser.subscription?.reservationType || 'flex')}
                        >
                          {savingChanges ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {configuringScheduleUser && (
                <Dialog open={true} onOpenChange={() => setConfiguringScheduleUser(null)}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                        Configurar horario fijo para {configuringScheduleUser.name || configuringScheduleUser.email}
                        </DialogTitle>
                        <DialogDescription>
                        Define las clases que se reservarán automáticamente cada semana
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Lista de horarios configurados */}
                        <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Clases programadas ({fixedSchedule.length})</h4>
                            <Button onClick={addScheduleSlot} size="sm">
                            Añadir clase
                            </Button>
                        </div>

                        {fixedSchedule.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                            <p>No hay clases programadas</p>
                            <p className="text-sm">Haz click en "Añadir clase" para comenzar</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                            {fixedSchedule.map((slot, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    {/* Tipo de clase */}
                                    <div>
                                    <label className="block text-sm font-medium mb-1">Tipo de clase</label>
                                    <Select
                                        value={slot.classType}
                                        onValueChange={(value) => updateScheduleSlot(index, 'classType', value)}
                                    >
                                        <SelectTrigger>
                                        <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="pilates">Pilates</SelectItem>
                                        <SelectItem value="funcional">Funcional</SelectItem>
                                        <SelectItem value="yoga">Yoga</SelectItem>
                                        <SelectItem value="barre">Barre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>

                                    {/* Día de la semana */}
                                    <div>
                                    <label className="block text-sm font-medium mb-1">Día</label>
                                    <Select
                                        value={slot.dayOfWeek.toString()}
                                        onValueChange={(value) => updateScheduleSlot(index, 'dayOfWeek', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                        <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="1">Lunes</SelectItem>
                                        <SelectItem value="2">Martes</SelectItem>
                                        <SelectItem value="3">Miércoles</SelectItem>
                                        <SelectItem value="4">Jueves</SelectItem>
                                        <SelectItem value="5">Viernes</SelectItem>
                                        <SelectItem value="6">Sábado</SelectItem>
                                        <SelectItem value="0">Domingo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>

                                    {/* Hora */}
                                    <div>
                                    <label className="block text-sm font-medium mb-1">Hora</label>
                                    <Input
                                        type="time"
                                        value={slot.time}
                                        onChange={(e) => updateScheduleSlot(index, 'time', e.target.value)}
                                    />
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={slot.autoReserve}
                                            onChange={(e) => updateScheduleSlot(index, 'autoReserve', e.target.checked)}
                                        />
                                        Auto-reservar
                                        </label>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeScheduleSlot(index)}
                                    >
                                        Eliminar
                                    </Button>
                                    </div>
                                </div>
                                
                                {/* Vista previa */}
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">Resumen:</span> {slot.classType} los {getDayName(slot.dayOfWeek)} a las {slot.time}
                                    {slot.autoReserve ? ' (reserva automática)' : ' (manual)'}
                                </div>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>

                        {/* Información adicional */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Información importante</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Las reservas automáticas se procesan cada día para el día siguiente</li>
                            <li>• Si una clase está completa, no se realizará la reserva automática</li>
                            <li>• El usuario puede cancelar reservas automáticas si es necesario</li>
                            <li>• Cambiar a horario fijo desactiva la reserva manual</li>
                        </ul>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                        variant="outline" 
                        onClick={() => {
                            setConfiguringScheduleUser(null);
                            setFixedSchedule([]);
                        }}
                        disabled={savingSchedule}
                        >
                        Cancelar
                        </Button>
                        <Button 
                        onClick={() => saveFixedSchedule(configuringScheduleUser.id, fixedSchedule)}
                        disabled={savingSchedule}
                        >
                        {savingSchedule ? 'Guardando...' : 'Guardar horario'}
                        </Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
                )}

                </TabsContent>
        </Tabs>

        {/* Usuarios sin reservas y duplicados */}
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
                <AccordionTrigger>Usuarios Duplicados ({duplicateUsers.length} emails)</AccordionTrigger>
                <AccordionContent>
                    {duplicateUsers.map((dup, i) => (
                    <div key={i} className="mb-6 p-4 border rounded-lg">
                        <p className="font-bold mb-2 text-red-600">Email duplicado: {dup.email}</p>
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

        {/* Resumen de estadísticas adicionales */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Estadísticas adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usuarios sin reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersWithoutReservations.length}</div>
                <p className="text-sm text-gray-600 mt-1">
                  {((usersWithoutReservations.length / userStats.total) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emails duplicados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{duplicateUsers.length}</div>
                <p className="text-sm text-gray-600 mt-1">
                  Requieren limpieza
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasa de conversión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((reservations.length / userStats.total) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Usuarios con reservas activas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}