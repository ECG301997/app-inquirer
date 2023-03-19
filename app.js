require('colors')
const { guardarDB, leerDB } = require('./db/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar,confirmar, mostrarListadoCheckList } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

const main = async () => {

    let opt = ''
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) {
        // Establecer las tareas
        tareas.cargarTareasFromArray(tareasDB)
    }

    do {
        // Imprimir el menú
        opt = await inquirerMenu();
        switch (opt) {
            case '1': // crear tarea
                const desc = await leerInput('Descripcion: ')
                tareas.crearTarea(desc)            
                break;
            case '2': // Listar todas las tareas
                tareas.listadoCompleto();
                break;
            case '3': // listar completadas
                tareas.listarTareasEstado(true);
                break;
            case '4': // listar pendientes
                tareas.listarTareasEstado(false);
                break;
            case '5': // completado - Pendiente
                const ids = await mostrarListadoCheckList( tareas.listadoArr);
                tareas.toogleCompletadas(ids);
                break;
            case '6': // Eliminar tareas
                const id = await listadoTareasBorrar(tareas.listadoArr)
                if(id !== '0'){
                    const ok = await confirmar('¿Esta seguro en borrar?')
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada')
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr)
        // realizar pausa
        if(opt !== '0') await pausa();

    } while (opt !== '0');



}



main()