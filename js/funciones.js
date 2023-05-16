$(document).ready(function() {
  JsonParaLocalStorage()
    .then(() => {
      let datos = JSON.parse(localStorage.getItem('products')); 
      $('#tablaInventario').DataTable({
        data: datos,
        columns:[
          {title:'ID',data:'ProductID'},
          {title:'Producto',data:'ProductName'},
          {title:'Categoria',data:'Category'},
          {title:'Precio',data:'UnitPrice'},
          {title:'Existencia',data:'UnitsInStock'},
          {title:'Nivel de reorden',data:'ReorderLevel'},
          {title: '', data:null, render:(data,type)=>{
            return '<button type="button" class="btn" style="background-image: url(\'../files/editar.png\'); background-size: cover; background-position: center; background-repeat: no-repeat;  height: 30px " onclick="llenarParaEditar('+
            data.ProductID+')"></button>';
          }},
          {title: '', data:null, render:(data,type)=>{
            return '<button type="button" class="btn " style="background-image: url(\'../files/eliminar.png\'); background-size: cover; background-position: center; background-repeat: no-repeat;  height: 30px " onclick="eliminar('+
            data.ProductID+')"></button>';
          }}
        ],
        createdRow: function(row, data, index){
          if(data.ReorderLevel > data.UnitsInStock){
            row.style.backgroundColor = '#FF4C4CAD';
          }
        },
        responsive: {
          details: {
              renderer: function ( api, rowIdx, columns ) {
                  var data = $.map( columns, function ( col, i ) {
                      return col.hidden ?
                      '<div class="d-flex flex-wrap me-3 mt-1">'+
                          '<div class="border border-secondary text-white fw-bold px-3 py-1" style="background-color: #5BC0F8;">'+col.title+'</div>'+
                              '<div class="border border-secondary px-2 py-1">'+col.data+'</div>'+
                      '</div>':
                          '';
                  } ).join('');
   
                  return data ?
                      $('<div class="w-100 d-flex flex-wrap "/>').append( data ) :
                      false;
              }
              //display: $.fn.dataTable.Responsive.display.modal()
          }
      },
      columnDefs: [
        { responsivePriority: 1, targets: [0,1,3,6,7] },
        { responsivePriority: 3, targets: [2] }
      ],
         "order": [[ 0, 'asc' ]]
      });
    })
    .catch(error => console.error(error));
});


function JsonParaLocalStorage(){
  return new Promise((resolve, reject) => {
    // Verificar si el JSON ya fue cargado en el localStorage
    if(!localStorage.getItem("jsonLoaded")) {
      fetch('./json/products.json')
        .then(response => response.json())
        .then(data => {
          // Guarda el objeto JSON en localStorage como una cadena de texto
          localStorage.setItem("products", JSON.stringify(data));
          // Cambia el valor de la bandera a true
          localStorage.setItem("jsonLoaded", true);
          resolve();
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    } else {
      resolve();
    }
  });
}

// Obtener los elementos del formulario
const form = document.querySelector('form');
const productoIDInput = document.getElementById('productoID');
const productoNameInput = document.getElementById('productoName');
const categoriaInput = document.getElementById('categoria');
const existenciaInput = document.getElementById('existencia');
const precioInput = document.getElementById('precio');
const fotoInput = document.getElementById('foto');
const nivelInput = document.getElementById('nivel');

let id = 1;

function guardar(){
    //Validar si ya existe un registro en LocalStorage 
    existenDatos();

    // Crear el objeto de empleado
    const product = {
      ProductID: id,
      ProductName: productoNameInput.value,
      Category: categoriaInput.value,
      UnitsInStock: existenciaInput.value,
      ReorderLevel: nivelInput.value,
      UnitPrice: precioInput.value,
      PhotoProduct: fotoInput.value
    };
  
    if(productoIDInput.value!=""){ // Producto a editar
      // Eliminar dato anterior y guardar el nuevo
      product.ProductID = parseInt(productoIDInput.value, 10);
      if(validar()){
        editar(product.ProductID, product);
        // Reiniciar el formulario
        form.reset();
        location.reload();
      }
    } else{ // Producto nuevo
      // Guardar el arreglo de productos en localStorage
      if(validar()){
        insertar(product);
        // Reiniciar el formulario
        form.reset();
        location.reload();
      }
    }
    
  
}

function cancelar(){
  form.reset();
}


function insertar(obj){
  var datos=JSON.parse(localStorage.getItem('products')); 
    datos.push(obj);
    localStorage.setItem('products',JSON.stringify(datos)); //Agregar item nuevo a localStorage
}


function llenarParaEditar(id){
  let datos = JSON.parse(localStorage.getItem('products')); 
  const index = datos.findIndex(product => product.ProductID === id);

  if(index == -1) return;

  // Llenar los campos con los datos que ya estaban en LocalStorage
  productoIDInput.value = datos[index]["ProductID"];
  productoNameInput.value = datos[index]["ProductName"];
  categoriaInput.value=datos[index]["Category"];
  existenciaInput.value = datos[index]["UnitsInStock"];
  precioInput.value = datos[index]["UnitPrice"];
  fotoInput.value = datos[index]["PhotoProduct"];
  nivelInput.value = datos[index]["ReorderLevel"];

  // Redirecciona al modal
  $('#productModal').modal('show');
}

function editar(id, producto){
  var opcion = confirm("¿Está seguro de que quiere actualizar el producto con ID = " + id + "?");
  if(opcion == true) { // Eliminar el registro anterior e insertar los nuevos datos
      var datos = JSON.parse(localStorage.getItem('products')); 
      const index = datos.findIndex(product => product.ProductID === id);
      if(index > -1){
          datos.splice(index, 1);
      }
      datos.push(producto);
      localStorage.setItem('products', JSON.stringify(datos));
}
}


function existenDatos(){
  let datos=JSON.parse(localStorage.getItem('products')); 
  datos.forEach(product => id=Math.max(id, product.ProductID+1)); // Toma el ID mayor de todos los empleados y le suma 1
  
}

function eliminar(id){
  var opcion = confirm("¿Está seguro de que quiere eliminar el producto con ID = " + id + "?");
  if (opcion == true) { // Buscar y eliminar el registro
      var datos = JSON.parse(localStorage.getItem('products')); 
      const index = datos.findIndex(product => product.ProductID === id);
      if(index > -1){
          datos.splice(index, 1);
      }
      localStorage.setItem('products', JSON.stringify(datos));

      location.reload();
  }
}

function validar() {
  // Verificar si algún campo está vacío
  if (
    productoNameInput.value === "" ||
    categoriaInput.value === "" ||
    existenciaInput.value === "" ||
    precioInput.value === "" ||
    nivelInput.value === ""
  ) {
    // Mostrar mensaje de error o realizar alguna acción adicional
    alert("Por favor, complete todos los campos.");
    return false; // Detener la ejecución de la función
  }
  
  return true;
  
}
