((d)=>{
    d.addEventListener("click", (e)=>{
        if(e.target.matches('input[type = "submit"]')){
            e.preventDefault();
            let formulario = d.querySelector("form");

            let funcion = eliminarFx(formulario.funcion.value);

            if(funcion.includes("sen")){
                funcion = funcion.replaceAll("sen", "sin")
            }

            try{

                if(funcion == ""){
                    throw formulario.funcion;
                }

                let a = esNumero(formulario.xa);
                formulario.xa.style.setProperty("background-color", "#fff");
                let b = esNumero(formulario.xb);
                formulario.xb.style.setProperty("background-color", "#fff");

                if(formulario.metodos.value == "biseccion"){
                    dibujarEncabezado(["Iteración", "Xa", "Xb", "Xr", "F(Xa)", "F(Xr)", "F(Xa)F(Xr)", "Ea(%)"]);
                    document.querySelector("tbody").textContent = "";
                    calcularRaizPorBiseccion(funcion, a, b, "", "", 1, null);
                    dibujar(funcion);
                }else if (formulario.metodos.value == "falsa_posicion"){
                    dibujarEncabezado(["Iteración", "Xa", "Xb", "F(Xa)", "F(Xb)", "Xr", "F(Xr)", "F(Xa)F(Xr)", "Ea(%)"]);
                    document.querySelector("tbody").textContent = "";
                    calcularRaizPorFalsaPosicion(funcion, a, b, "", "", "", 1, null);
                    dibujar(funcion);
                }else{
                    window.alert("Aún no ha escogido el método");
                }

            }catch(error){
                error.style.setProperty("background-color", "#E84B4B");
            }
        }
    });

    /**
     * Función para dibujar la gráfica de la función
     * @param {*} funcion 
     */
    function dibujar(funcion) {
        try {
            functionPlot({
                target: '#grafico',
                data: [{
                  fn: funcion,
                  sampler: 'builtIn',
                  graphType: 'polyline'
                }]
              });
        }
        catch (err) {
          console.log(err);
          alert(err);
        }
      }

    /**
     * Función para calcular la raíz por bisección
     * @param {*} funcion 
     * @param {*} a 
     * @param {*} b 
     * @param {*} raiz 
     * @param {*} fxaXfxr 
     * @param {*} i 
     * @param {*} error 
     */
    function calcularRaizPorBiseccion(funcion, a, b, raiz, fxaXfxr, i, error){
        if( error === null || Math.abs(error) > 0 ){
            let xa, xb;
            if(i == 1){
                xa = a;
                xb = b;
            }else{
                xa = fxaXfxr < 0?a:raiz;
                xb = fxaXfxr > 0?b:raiz;
            }
            let xr = (parseFloat(xa) + parseFloat(xb))/2;
            let fxa = math.evaluate(funcion.replaceAll("x", `(${xa})`));
            let fr = math.evaluate(funcion.replaceAll("x", `(${xr})`));
            let fxaXfr = parseFloat(fxa) * parseFloat(fr);
            let Ea = null;
            if(raiz !== ""){
                Ea = ((parseFloat(xr) - parseFloat(raiz))/parseFloat(xr))*100;
            }
            
            dibujarFila([i, xa, xb, xr, fxa, fr, fxaXfr, Ea]);
            //window.alert("Xr => " + xr + ", fxa => " + fxa + ", fr => " + fr + ", f(Xa)*f(Xr) => " + fxaXfr + ", Iteración => " + i + "Ea => " + Ea);
            i = i + 1;
            calcularRaizPorBiseccion(funcion, xa, xb, xr, fxaXfr, i,Ea);
        }
    }

    /**
     * Función para calcular la raíz por falsa posición
     * @param {*} funcion 
     * @param {*} a 
     * @param {*} b 
     * @param {*} raiz 
     * @param {*} fxr 
     * @param {*} fxaXfxr 
     * @param {*} i 
     * @param {*} error 
     */
    function calcularRaizPorFalsaPosicion(funcion, a, b, raiz, fxr, fxaXfxr, i, error){
        if(error === null || Math.abs(error) > 0){
            let xa, xb;
            if(i == 1){
                xa = a;
                xb = b;
            }else{
                xa = fxaXfxr < 0?a:fxr;
                xb = fxaXfxr > 0?b:raiz;
            }
            let fxa = math.evaluate(funcion.replaceAll("x", `(${xa})`));
            let fxb = math.evaluate(funcion.replaceAll("x", `(${xb})`));
            let xr = parseFloat(xb) - ((parseFloat(fxb)*parseFloat(parseFloat(xb) - parseFloat(xa)))/(parseFloat(fxb)-parseFloat(fxa)));
            let fr = math.evaluate(funcion.replaceAll("x", `(${xr})`));
            let fxaXfr = parseFloat(fxa) * parseFloat(fr);

            let Ea = null;
            if(raiz !== ""){
                Ea = ((parseFloat(xr) - parseFloat(raiz))/parseFloat(xr))*100;
            }

            dibujarFila([i, xa, xb, fxa, fxb, xr, fr, fxaXfr, Ea]);
            //window.alert("Xr => " + xr + ", fxa => " + fxa + ", fr => " + fr + ", f(Xa)*f(Xr) => " + fxaXfr + ", Iteración => " + i);
            i = i + 1;
            calcularRaizPorFalsaPosicion(funcion, xa, xb, xr, fr, fxaXfr, i, Ea);
        }
    }

    /**
     * Función para dibujar el encabezado de la tabla
     * @param {*} array 
     */
    function dibujarEncabezado(array){
        let $fila = document.createElement("tr");

        array.forEach(elemento => {
            let columna = document.createElement("th");
            columna.textContent = elemento;
            $fila.appendChild(columna); 
        });

        let $thead = document.querySelector("thead");
        $thead.textContent = "";
        $thead.appendChild($fila);
    }

    /**
     * Función para dibujar una fila
     * @param {*} array 
     */
    function dibujarFila(array){
        let $fila = document.createElement("tr");

        array.forEach(elemento =>{
            let columna = document.createElement("td");
            columna.textContent = elemento;
            $fila.appendChild(columna);
        });

        let $tbody = document.querySelector("tbody");
        $tbody.appendChild($fila);
    }

    /**
     * Función para eliminar f(x), F(X)
     * @param {*} cadena 
     * @returns 
     */
    function eliminarFx(cadena){
        let nuevaCadena = cadena;

        if(cadena.includes("f(x) = ")){
            nuevaCadena = cadena.replace("f(x) = ", "");
        } else if(cadena.includes("F(x) = ")){
            nuevaCadena = cadena.replace("F(x) = ", "");
        }else if(cadena.includes("F(X) = ")){
            nuevaCadena = cadena.replace("F(X) = ", "");
        }else if(cadena.includes("= ")){
            nuevaCadena = cadena.replace("= ", "");
        }
        return nuevaCadena.trim();
    }

    /**
     * Función para comprabar si el valor ingresado es un número
     * @param {*} valor 
     * @returns 
     */
    function esNumero(valor){
        if(!(/[0123456789]+/.test(valor.value.trim()))){
            throw valor;
        }

        return valor.value.trim();
    }
 })(document);
 