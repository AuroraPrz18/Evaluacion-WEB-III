document.addEventListener('DOMContentLoaded', (event) =>{
    console.log("El valor del parámetro es: " + category);
    JsonParaLocalStorage()
      .then(() => {
        let datos = JSON.parse(localStorage.getItem('products'));
        Object.entries(datos).forEach(([key, value])=>{
            if(category=='category1' && value.Category!='Dairy Products'){
              
            }else if(category=='category2' && value.Category!='Beverages'){

            }else if(category=='category3' && value.Category!='Meat/Poultry'){

            }else if(category=='category4' && value.Category!='Seafood'){

            }else{
                var photo = ""
                if(value.Category=='Dairy Products'){
                  photo = "Dairy-products.jpg"
                }else if(value.Category=='Beverages'){
                  photo = "refrescos.png"
                }else if(value.Category=='Meat/Poultry'){
                  photo = "Meat.jpg"
                }else if(value.Category=='Seafood'){
                  photo = "seafood.jpg"
                }
                var div = document.createElement('div');
                div.setAttribute('class', "card col-12 col-md-6 col-lg-3")
                div.setAttribute('style', 'width: 18rem;')
                div.innerHTML = `
                    <img src="./files/${photo}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <div class="row">
                            <p class="card-text col-6 categoria">${value.Category}</p>
                            <p class="card-text col-6 stock">STOCK: ${value.UnitsInStock}</p>
                        </div>
                        <h5 class="card-title">${value.ProductName}</h5>
                        <p class="precio">$${value.UnitPrice}</p>
                        <div class="btn-section-card">
                            <a href="#" class="btn btn-add">+</a>
                        </div>
                    </div>
                `;
                document.getElementById('products').appendChild(div);
            }
        })
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