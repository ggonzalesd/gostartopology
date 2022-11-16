(()=>{

    const isPrintable = (keycode)=>{
        var valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)
        return valid;
    }

    const createPar = (focus, text="")=>{
        const par = document.createElement("p")
        par.classList.add("text-p")
        if(focus)
            par.classList.add("focus-p")
        par.innerText = text
        return par
    }

    const setFocus = (p) => {
        p.classList.add("focus-p")
    }
    const unFocus = (p) => {
        p.classList.remove("focus-p")
    }


    let index_p = 1
    let lines = []

    const consoleSpan = document.getElementById("console")
    const editorWrapper = document.getElementById("editor-wrapper")

    consoleSpan.addEventListener("click", async (ev)=>{
        const response = await fetch("http://192.168.1.44:8080/update-doc", {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({doc:lines})
        });
        console.log(response)
    })


    document.addEventListener("keydown", (ev)=>{
    

        switch(ev.key){

            case "ArrowUp":
            case "ArrowDown":

                if(editorWrapper.children.length > 0){
                    unFocus(editorWrapper.children[index_p])
                    editorWrapper.children[index_p].innerText = lines[index_p]
    
                    if(ev.key === "ArrowUp"){
                        if(index_p > 0)
                            index_p--
                    } else {
                        if(index_p < editorWrapper.children.length-1)
                            index_p++
                    }
                    setFocus(editorWrapper.children[index_p])
                    editorWrapper.children[index_p].innerText = lines[index_p] + "|"

                }
            
            break

            case "Enter":
                if(editorWrapper.children.length == 0){
                    const p = createPar(true)
                    index_p = 0
                    lines.push("")
                    editorWrapper.appendChild(p)
                    editorWrapper.children[index_p].innerText = lines[index_p] + "|"
                } else {
                    editorWrapper.children[index_p].innerText = lines[index_p]
                    unFocus(editorWrapper.children[index_p])
                    
                    if(editorWrapper.children.length-1 === index_p){
                        editorWrapper.appendChild(createPar(true, ""))
                        lines.push("");
                        index_p++
                    } else {
                        editorWrapper.insertBefore(createPar(true, ""), editorWrapper.children[index_p])
                        lines.splice(index_p, 0, "");
                    }
                    editorWrapper.children[index_p].innerText = lines[index_p] + "|"
                }
            break

            case "Backspace":
                if(index_p < editorWrapper.children.length && editorWrapper.children.length > 0){
                    if (lines[index_p].length == 0){
                        editorWrapper.removeChild(editorWrapper.children[index_p])
                        lines = lines.filter((v, i)=>i!=index_p)
                        if(index_p>0)
                            index_p--
                        if (editorWrapper.children.length > 0 && index_p >= 0){
                            setFocus(editorWrapper.children[index_p])
                            editorWrapper.children[index_p].innerText = lines[index_p] + "|"
                        }
                    } else {
                        lines[index_p] = lines[index_p].substring(0, lines[index_p].length-1)
                        editorWrapper.children[index_p].innerText = lines[index_p] + "|"
                    }
                }

            break


            default:
                if(isPrintable(ev.keyCode)){
                    if(editorWrapper.children.length == 0){
                        const p = createPar(true, ev.key)
                        index_p = 0
                        lines.push(ev.key)
                        editorWrapper.appendChild(p)
                    } else {
                        lines[index_p] += ev.key
                    }
                    editorWrapper.children[index_p].innerText = lines[index_p] + "|"
                }
        }

        (async ()=>{
            await fetch("http://192.168.1.44:8080/update-doc", {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({doc:lines})
            })
        })();
    })


})()