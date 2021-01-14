
let pajaro

let tuberias = []

let segundos=0

let segundosAnteriores=-1

let nombre

let puntaje

let tablaPuntajes = []


function setup() {

	createCanvas(window.innerWidth, window.innerHeight)

	pajaro = new Pajaro()

	tuberias.push(new Tuberia())

	vex.dialog.alert({ unsafeMessage: 
		`<h1>Como es tu nombre?</h1><br/>
		<input id="nombre" type="text"/>`,
		callback: function (data) {

			loop()

			nombre = document.getElementById("nombre").value

			console.log(nombre)
			
    	}
	})

	noLoop()

}

function draw() {

	background("#70C5CE")

	let hoy = new Date()

	let segundosReales = hoy.getSeconds()

	if(segundosAnteriores != segundosReales){
		segundos++
		segundosAnteriores=segundosReales
	}


	for (let i = 0; i < tuberias.length; i++){

		tuberias[i].mostrar()
	    tuberias[i].actualizar()

	    if(tuberias[i].toca(pajaro)){
	    	
	    	puntaje = segundos * 32
	    	
	    	console.log("Puntaje: " + puntaje)
	    	
	    	noLoop()

			fetch('https://flappy-back.herokuapp.com/nuevoPuntaje/'+nombre+'/'+puntaje)
				.then(response => response.json())
				.then(data => {

					console.log(data); 

					tablaPuntajes=data

					tablaPuntajes.sort((a, b) => parseFloat(b.mejorPuntaje) - parseFloat(a.mejorPuntaje))

					let mensaje = `<h1>Tabla de puntajes:</h1>
						</br>
						<table class="table table-striped table-dark">
						  <thead>
						    <tr>
						      <th scope="col">#</th>
						      <th scope="col">Nombre</th>
						      <th scope="col">Ultimo Puntaje</th>
						      <th scope="col">Mejor Puntaje</th>
						    </tr>
						  </thead>
						  <tbody>`;


					for (let i = 0; i < tablaPuntajes.length; i++) {

						mensaje = mensaje + `
						    <tr>
						      <th scope="row">`+(i+1)+`</th>
						      <td>`+tablaPuntajes[i].nombre+`</td>
						      <td>`+tablaPuntajes[i].ultimoPuntaje+`</td>
						      <td>`+tablaPuntajes[i].mejorPuntaje+`</td>
						    </tr>`
					}

					mensaje = mensaje + `</tbody></table>`
					
					vex.dialog.alert({ 

						unsafeMessage: mensaje,

						callback: function (data) {

							pajaro = new Pajaro()

							tuberias = []

							segundos=0

							segundosAnteriores=-1

							loop()

				    	}
					})



				})



	    	
	    }

	}

	pajaro.actualizar()
	pajaro.mostrar()
	

	if(Math.floor(Math.random() * 100) == 2){
		tuberias.push(new Tuberia())
	}


}

function keyTyped() {
	
	if((key == ' ')){

		pajaro.subir()
	
	}

  }

function mouseReleased() {
	pajaro.subir()
}




function Pajaro(){

	this.x = width/2-40

	this.y = height/2

	this.mostrar = function(){
		ellipse(this.x,this.y,20,20)
	}

	this.actualizar = function(){
		this.y = this.y + 2

		if(this.y > height){
			this.y=height
		}

	}

	this.subir = function(){
		
		this.y= this.y - 40

	}

}

function Tuberia() {
  this.arriba = random(height / 2)
  this.abajo = random(height / 2)
  this.x = width
  this.ancho = 20

  this.toco = false

  this.toca = function(pajaro) {
    if (pajaro.y < this.arriba || pajaro.y > height - this.abajo) {
      if (pajaro.x > this.x && pajaro.x < this.x + this.ancho) {
        this.toco = true
        return true
      }
    }
    this.toco = false
    return false
  };

  this.mostrar = function() {
    fill(100)
    rect(this.x, 0, this.ancho, this.arriba)
    rect(this.x, height - this.abajo, this.ancho, this.abajo)
  };

  this.actualizar = function() {
    this.x -= 2
  };


}