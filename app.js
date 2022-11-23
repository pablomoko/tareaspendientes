require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');


const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray( tareasDB);
    }
   
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listaCompleto();                
                break;
            case '3':
                tareas.listarPendienteCompletadas(true);                
                break;
            case '4':
                tareas.listarPendienteCompletadas(false);                  
                break;
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr); 
                tareas.toggleCompletadas(ids);        
                break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);  
                if (id!='0') {
                    const ok = await confirmar('Esta seguro ?');
                    if(ok){
                        tareas.borrarTarea(id);
                    }                    
                }
               break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();


    } while (opt !== '0');

}

main();