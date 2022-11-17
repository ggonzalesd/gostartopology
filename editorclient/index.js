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

    const timeNow = ()=> (window.performance.timeOrigin + window.performance.now())*1000000 

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
    let modified = timeNow()
    let lines = []

    const fetchRefreshDocument = (server)=> fetch(server + "/refresh-doc", {
        method: "GET",
        headers: { 'Accept': '*/*'}
    })
    
    const fetchSendDocument = (server)=> fetch(server + "/update-doc", {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({modified: timeNow(), doc: lines})
    })

    const editorWrapper = document.getElementById("editor-wrapper")

    const updateWrapper = (data)=>{
        modified = data['modified']
        doc = data['doc']
        editorWrapper.innerHTML = ""
        if(index_p<0)
            index_p = 0
        if(index_p>=doc.length)
            index_p = doc.length-1
        
        for(let i=0; i<doc.length; i++)
            editorWrapper.appendChild(
                createPar(false, doc[i])
            )
        setFocus(editorWrapper.children[index_p])
        lines = doc
    }

    fetchRefreshDocument("http://localhost:8080")
    .then(data => data.text())
    .then(data => {
        data = JSON.parse(data)
        updateWrapper(data)
    })
    .catch(err => {
        console.error(err)
    })

    setInterval(() => {
        fetchRefreshDocument("http://localhost:8080")
        .then(data => data.text())
        .then(data => {
            data = JSON.parse(data)
            //console.log(data['modified'] > modified)
            if(data['modified'] > modified)
                updateWrapper(data)
        })
        .catch(err => {
            console.error(err)
        })
    }, 500);

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
                    editorWrapper.children[index_p].innerText = lines[index_p]
                }
            
            break

            case "Enter":
                if(editorWrapper.children.length == 0){
                    const p = createPar(true)
                    index_p = 0
                    lines.push("")
                    editorWrapper.appendChild(p)
                    editorWrapper.children[index_p].innerText = lines[index_p]
                } else {
                    editorWrapper.children[index_p].innerText = lines[index_p]
                    unFocus(editorWrapper.children[index_p])
                    
                    if(editorWrapper.children.length-1 === index_p){
                        editorWrapper.appendChild(createPar(true, ""))
                        lines.push("");
                    } else {
                        editorWrapper.insertBefore(createPar(true, ""), editorWrapper.children[index_p+1])
                        lines.splice(index_p+1, 0, "");
                    }
                    index_p++
                    editorWrapper.children[index_p].innerText = lines[index_p]
                }
                modified = timeNow()
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
                            editorWrapper.children[index_p].innerText = lines[index_p]
                        }
                    } else {
                        lines[index_p] = lines[index_p].substring(0, lines[index_p].length-1)
                        editorWrapper.children[index_p].innerText = lines[index_p]
                    }
                    modified = timeNow()
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
                    editorWrapper.children[index_p].innerText = lines[index_p]
                    modified = timeNow()
                }
        }

        if(isPrintable(ev.keyCode) || ev.key === "Backspace" || ev.key === "Enter"){
            fetchSendDocument("http://localhost:8080")
            .catch(err => console.err(err))
        }
    })
})()