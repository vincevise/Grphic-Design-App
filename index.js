var currentObj = 0; 
var error = document.getElementById('error');
var download = document.getElementById('download')
var color = document.getElementById('color-picker')
var cropBtn = document.getElementById('crop') 
let isResizing = false;  
let isSelected = false;
let layerContainer = document.getElementById('layer-container')
let shapes = document.querySelectorAll('.shape') 
let savedData = document.getElementById('saved-data')
var deleteButton = document.getElementById('delete')
let drawingBoard = document.getElementById('drawing-board')
const hiddenImg = document.createElement('img')
var widthInput = document.getElementById('width-input')
var heightInput = document.getElementById('height-input')
var submitBtn = document.getElementById('submitBtn') 
var percentage = document.getElementById('percentage-value')
let ratio = 1;

submitBtn.onclick = canvasSize

function canvasSize(){
      
    if(widthInput.value > (innerWidth - 260) || heightInput.value > (innerHeight - 60)){
       let w = widthInput.value/(innerWidth - 260)
       let h = heightInput.value/(innerHeight - 60)
       if(w > h){
        drawingBoard.style.width =  widthInput.value/w + 'px'
        drawingBoard.style.height =  heightInput.value/w + 'px' 
            percentage.innerText = Math.floor(1/w*100) + " " + '%'
            ratio = w
       }else if(h > w){
        drawingBoard.style.width =  widthInput.value/h + 'px'
        drawingBoard.style.height =  heightInput.value/h + 'px' 
            percentage.innerText = Math.floor(1/h*100 ) + " " + '%'
            ratio = h
       }
    }else{  
        drawingBoard.style.width = widthInput.value +'px'
        drawingBoard.style.height = heightInput.value + 'px'
    }   
}



// Input Image Display
let fileInput  ;
var imgInput = document.getElementById('file-input')
imgInput.addEventListener('change',function(event){
    fileInput = URL.createObjectURL( event.target.files[0]) 
    error.innerText = ''  
    hiddenImg.setAttribute('src',fileInput)
     addShapes('image')
})
 

drawingBoard.addEventListener('click',function(){ 
    for (let index = 0; index < drawingBoard.children.length; index++) {
        if( drawingBoard.children[index].classList.contains('selected'))
        {
            drawingBoard.children[index].classList.remove('selected')
            isSelected = false; 
            cropBtn.value = 'Crop'
        }
    }   
}) 
//Add shapes
 
function addShapes(shapeName){
    let newShape = document.createElement('div')
    // RESIZE
    let nwResize = document.createElement('div')
    nwResize.classList.add('resizer')
    nwResize.classList.add('nw')
    let neResize = document.createElement('div')
    neResize.classList.add('resizer')
    neResize.classList.add('ne')
    let seResize = document.createElement('div')
    seResize.classList.add('resizer')
    seResize.classList.add('se')
    let swResize = document.createElement('div')
    swResize.classList.add('resizer')
    swResize.classList.add('sw')

 // ADD TEXT
 if(shapeName=='text'){ 
     newShape.setAttribute('id','text'+ new Date().getTime())
     newShape.classList.add('shape') 
     drawingBoard.appendChild(newShape)
 
     const newText = document.createElement('input')
     newText.setAttribute('type','text')
     newText.setAttribute('class','input-text')
     newText.setAttribute('value','Add-Text')
     newText.style.color = color.value 
     newShape.appendChild(newText)
 }
 //ADD IMAGE
 else if(shapeName == 'image' && fileInput){ 
     // DIV SHAPE
    
     newShape.classList.add('cover')
     newShape.style.width = hiddenImg.naturalWidth/10 + 'px'
     newShape.style.height = hiddenImg.naturalHeight/10 + 'px'
     newShape.classList.add('shape')
     newShape.setAttribute('id',shapeName+ new Date().getTime())  
     drawingBoard.appendChild(newShape)
     
     // IMAGE
     let newImg = document.createElement('img')
     newImg.classList.add(shapeName)
     newImg.setAttribute('src',fileInput)
     // newImg.classList.add('crop')

     newShape.appendChild(newImg)    
     newShape.appendChild(nwResize)
     newShape.appendChild(neResize)
     newShape.appendChild(swResize)
     newShape.appendChild(seResize)  

 }else if(shapeName== 'circle' || shapeName == 'rect'){ 
     
     // DIV SHAPE
     newShape.classList.add('cover')
     newShape.classList.add('shape')
     newShape.style.width = '100px'
     newShape.style.height = '100px'
     
     newShape.setAttribute('id',shapeName+new Date().getTime())  
     drawingBoard.appendChild(newShape)
     
     // DIV RECT
     let newRect = document.createElement('div')
     newRect.classList.add(shapeName)
     newShape.appendChild(newRect)
     newRect.style.backgroundColor = color.value 
     newRect.style.position = 'default' 
  
     newRect.appendChild(nwResize)
     newRect.appendChild(neResize)
     newRect.appendChild(swResize)
     newRect.appendChild(seResize)       
    }else{
        error.innerText = 'Please upload File' 
    }
}


// Add Shapes
let addShape = document.querySelectorAll('.shape-button')
addShape.forEach((item,index)=>{ 
    let shapeName = item.getAttribute('id').slice(4) 
 
    item.addEventListener('click',()=>{
        addShapes(shapeName)
        dragDropResize() 
        displayOrder()
        layersFunction()
    } )
    
}) 
 
 
// Crop Button
cropBtn.addEventListener('click',function(){
    if(isSelected){
        for (let i = 0; i < drawingBoard.children.length; i++) {
            let element = drawingBoard.children[i]   
            if(element.classList.contains('selected') && element.children[0].classList.contains('image')){
                if(!element.children[0].classList.contains('crop')){
                    element.children[0].classList.remove('uncrop')
                    element.children[0].classList.add('crop')
                }else if(!element.children[0].classList.contains('uncrop')){
                    element.children[0].classList.remove('crop')
                    element.children[0].classList.add('uncrop')
                }
            } 
        } 
    }
})

// Change Color
color.onchange = function(){
    if(isSelected){
        for (let i = 0; i < drawingBoard.children.length; i++) {
            let element = drawingBoard.children[i]   
            if(element.classList.contains('selected') && (element.children[0].classList.contains('rect') || element.children[0].classList.contains('circle'))){
                element.children[0].style.backgroundColor = color.value
            }
            if(element.classList.contains('selected') && element.children[0].classList.contains('input-text')){
                element.children[0].style.color = color.value 
            }
        } 
    }
} 

// Change Font Size
let fontSize = document.getElementById('font-size')
fontSize.onchange = function(){
    if(isSelected){
        for (let i = 0; i < drawingBoard.children.length; i++) {
            let element = drawingBoard.children[i]   
            if(element.classList.contains('selected') && element.children[0].classList.contains('input-text')){
                element.children[0].style.fontSize = fontSize.value + 'px'
                
            }
        } 
    }
} 

// Display on Canvas 
download.addEventListener('click',function(){ 
    const canvasItems = drawingBoard.children 
    // canvas initialization
    const canvas = document.getElementById('mycanvas')
    canvas.width = drawingBoard.getBoundingClientRect().width*ratio;
    canvas.height = drawingBoard.getBoundingClientRect().height*ratio;
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < canvasItems.length; i++) {  

        var shapeName = canvasItems[i].children[0].classList[0]
        var shape = canvasItems[i] 
        var sizePosition = canvasItems[i].getBoundingClientRect() 
        for (const key in sizePosition) { 
            sizePosition[key] = sizePosition[key]*ratio
        }

        var color = canvasItems[i].children[0].style.backgroundColor
         
         if(shapeName == 'rect'){ 

            ctx.beginPath(); 
            ctx.fillStyle = color;
            ctx.fillRect(
                sizePosition.x, 
                sizePosition.y, 
                sizePosition.width, 
                sizePosition.height);
            ctx.stroke()
        }
        else if(shapeName == 'circle'){
            ctx.beginPath();
            ctx.arc(
                sizePosition.x + sizePosition.width/2, 
                sizePosition.y + sizePosition.width/2, 
                sizePosition.width/2, 
                0, 
                2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
        else if(shapeName == 'image'){ 
            var img = canvasItems[i].children[0]
             if(shape.children[0].classList.contains('crop')){
                var imgCanvas = document.createElement('canvas')
                
                imgCanvas.width = sizePosition.width
                imgCanvas.height = sizePosition.height

                let imgCtx = imgCanvas.getContext('2d')
                imgCtx.fillStyle = 'red' 
                imgCtx.beginPath();
                imgCtx.arc(
                     sizePosition.width/2,
                     sizePosition.height/2,
                    sizePosition.width/2,0,
                    Math.PI*2); 
                imgCtx.fill();

                imgCtx.globalCompositeOperation = 'source-in'
                imgCtx.beginPath(); 
                imgCtx.drawImage(img, 
                    0, 
                    0,
                    sizePosition.width,
                    sizePosition.height);  
                imgCtx.stroke()
               
                // Genreating a Cropped Image Link Async Function
                var cropLink = imgCanvas.toDataURL('image/png',1)
                
                var imgCrop = document.createElement('img')
                imgCrop.src = cropLink;
                imgCrop.style.width = imgCanvas.width;
                imgCrop.style.height = imgCanvas.height 

                // Displaying on Orginal Canvas
                ctx.beginPath(); 
                ctx.drawImage(imgCrop, sizePosition.x, sizePosition.y,sizePosition.width,sizePosition.height);   
                ctx.stroke()

             }else{ 
                ctx.beginPath(); 
                ctx.drawImage(img, sizePosition.x, sizePosition.y,sizePosition.width,sizePosition.height);  
                ctx.stroke()
             }
          
        }
        else if(shapeName == 'input-text'){ 
            var text = canvasItems[i].children[0]; 
            var textProp = text.getBoundingClientRect();

            for (const key in textProp) {
                textProp[key] = textProp[key]*ratio;
            }

            var fontSize =  textProp.height-3 + 'px'; 
            ctx.beginPath();  
            ctx.fillStyle = 'black'
            ctx.font = fontSize+" Arial";
            ctx.fillText(text.value, textProp.x, textProp.height + textProp.y-6);
            ctx.stroke()
        }
    }

    const imageLink = document.createElement('a');  
    imageLink.download = 'canvas.png'
    imageLink.href = canvas.toDataURL('image/png',1); 
    imageLink.click();
 
}) 

// Delete Function
function deleteObj(e){  
    if(isSelected === true){
        for (let i = 0; i < drawingBoard.children.length; i++) {
            if(drawingBoard.children[i].classList.contains('selected')){
                console.log(drawingBoard.children[i])
               var element = drawingBoard.children[i].getAttribute('id') 
               var deleteEle = document.getElementById(element)
                deleteEle.remove(deleteEle)
               isSelected = false; 
            }
       }
    }
    dragDropResize()
}
 

// Saving data when the window is closed
window.onunload = function(){
    for (let i = 0; i < drawingBoard.children.length; i++) { 
        if(drawingBoard.children[i].classList.contains('selected')){
            drawingBoard.children[i].classList.remove('selected')
            isSelected = false
        }
    }
    let data = domToJSON();
    localStorage.setItem('newItem',data)
}   

//  Save
let save = document.getElementById('save')
save.onclick = function(){ 
    let data = domToJSON(); 
    let fileName = prompt('File Name') 
    localStorage.setItem(fileName.slice(0,10),data) 

    // display it on saved data
    displaySavedData() 
};

// display it on saved data on the sidebar
function displaySavedData(){  
    savedData.innerHTML = '' 
    for (let i = 0; i < localStorage.length; i++) {
        let div = document.createElement('div')
        div.setAttribute('id', Object.entries(localStorage)[i][0])
        div.innerHTML = `<span>${Object.entries(localStorage)[i][0]}</span>  <span class="delete-file">X<span>`
        savedData.appendChild(div)
    }
    crud()
}

function domToJSON(){ 
    const data = drawingBoard.children 
    const canvasDimesion ={
        canvasDimension:{
            width: drawingBoard.getBoundingClientRect().width,
            height: drawingBoard.getBoundingClientRect().height,
            canvasRatio: ratio
        }
    }

    const shapesData = []
    for (let i = 0; i < data.length; i++) { 

        let a = {
            id:data[i].getAttribute('id'),
            shapeType:data[i].children[0].classList[0],
            left:data[i].children[0].getBoundingClientRect().x,
            top:data[i].children[0].getBoundingClientRect().y - 50,
            width:data[i].children[0].getBoundingClientRect().width,
            height:data[i].children[0].getBoundingClientRect().height,
        }
       
        if(data[i].children[0].classList[0]==='rect' || data[i].children[0].classList[0]=== 'circle'){ 
            shapesData.push({
                ...a,
                backgroundColor:data[i].children[0].style.backgroundColor
            })
        } if(data[i].children[0].classList[0]==='image'){ 
            shapesData.push({
                ...a,
                imgSrc:data[i].children[0].src,
                cropped:data[i].children[0].classList.contains('crop')
            })
        } if(data[i].children[0].classList[0]==='input-text'){ 
            shapesData.push({
                ...a,
                fontSize:data[i].children[0].style.fontSize,
                color:data[i].children[0].style.color,
                value:data[i].children[0].value
            })
        } 
    }
    let jsonData = {...canvasDimesion,shapesData:[...shapesData]}
    return JSON.stringify(jsonData) 
}

 console.log();
window.onload = function(){
       
    let db = document.querySelector('#drawing-board') 

    for (let i = 0; i < savedData.children.length; i++) {
        savedData.children[i].onclick = function(){
            console.log('clicked')
        }  
    }  
    // saved files 
    displaySavedData()

    // Get Data from Local Storage
    let data =  JSON.parse(localStorage.getItem('newItem'))
    
    displayDataOnContainer(data); 
    
    let shape = document.querySelectorAll('.shape')  

    
    // DRAG AND DROP Resize
    dragDropResize()

    // Delete from keyboard
    window.onkeydown = function(e){
        if(e.key == 'Delete'){
            deleteObj()
        }
    }
    // Delete Element
    deleteButton.onclick = deleteObj 

    // display and delete files from local storage
    crud()
    displayOrder()
    layersFunction()
} 

function crud(){
     // get data from storage 
     let localStore = savedData.children
     for (let i = 0; i < localStore.length; i++) {
         localStore[i].ondblclick = ()=> {
             drawingBoard.innerHTML = ''
             let data = JSON.parse(localStorage.getItem(localStore[i].getAttribute('id')))    
             displayDataOnContainer(data)
             dragDropResize()
         }
       
         localStore[i].children[1].onclick = function(event){
             // console.log('red')
             localStorage.removeItem(localStore[i].getAttribute('id'))
             displaySavedData()
         } 
     }
}

function deleteDataFromStorage(e){
    console.log(e.target)
}
//////////////////////////
function displayDataOnContainer(jsonData){ 
    
    let {canvasDimension,shapesData} = jsonData
    let data = shapesData;  
    // Layer Order Container
    

    ratio = canvasDimension.canvasRatio
    drawingBoard.style.width = canvasDimension.width +'px'
    drawingBoard.style.height = canvasDimension.height +'px'

    widthInput.value = Math.round(canvasDimension.width * ratio);
    heightInput.value = Math.round(canvasDimension.height * ratio) ;
    percentage.innerText = `${Math.round((1/ratio)*100)} %`
    // get data from local storage and display on playground container
    for (let i = 0; i < data.length; i++) {
        
        let newShape = document.createElement('div')
        newShape.classList.add('cover')
        newShape.classList.add('shape')
        newShape.setAttribute('id',data[i].id)
        drawingBoard.appendChild(newShape)

        // RESIZE
        let nwResize = document.createElement('div')
        nwResize.classList.add('resizer')
        nwResize.classList.add('nw')
        let neResize = document.createElement('div')
        neResize.classList.add('resizer')
        neResize.classList.add('ne')
        let seResize = document.createElement('div')
        seResize.classList.add('resizer')
        seResize.classList.add('se')
        let swResize = document.createElement('div')
        swResize.classList.add('resizer')
        swResize.classList.add('sw')

        if(data[i].shapeType == 'rect' || data[i].shapeType == 'circle'){

            // DIV RECT
            let newRect = document.createElement('div')
            newRect.classList.add(data[i].shapeType)
            newShape.appendChild(newRect)
            newRect.style.backgroundColor = data[i].backgroundColor 
            newShape.style.position = 'absolute' 
            newShape.style.width = data[i].width + 'px'
            newShape.style.height = data[i].height + 'px'
            newShape.style.left = data[i].left + 'px'
            newShape.style.top = data[i].top + 'px'
            
            newRect.appendChild(nwResize)
            newRect.appendChild(neResize)
            newRect.appendChild(swResize)
            newRect.appendChild(seResize)  
        }
        if(data[i].shapeType == 'image'){
             
            let newImg = document.createElement('img');
            newImg.classList.add(data[i].shapeType)
            if(data[i].cropped==true){
                newImg.classList.add('crop')
            }
            
            newImg.setAttribute('src',data[i].imgSrc)
             
            
            newShape.style.position = 'absolute'
            newShape.style.width = data[i].width + 'px'
            newShape.style.height = data[i].height + 'px'
            newShape.style.left = data[i].left + 'px'
            newShape.style.top = data[i].top + 'px'

            newShape.appendChild(newImg);
            newShape.appendChild(nwResize);
            newShape.appendChild(neResize);
            newShape.appendChild(swResize);
            newShape.appendChild(seResize);

        }if(data[i].shapeType == 'input-text'){ 
            newShape.style.postion = 'absolute'
            newShape.style.left = data[i].left + 'px'
            newShape.style.top = data[i].top + 'px' 

            let newText = document.createElement('input')
            
            newText.setAttribute('type','text')
            newText.classList.add('input-text')
            newText.setAttribute('value',data[i].value)
            newText.style.fontSize = data[i].fontSize
            newShape.appendChild(newText)
            newText.style.color = data[i].color
        }
    }
}

 

function dragDropResize(){
    let shape = document.querySelectorAll('.shape')  

    // DRAG AND DROP
    shape.forEach((ele,index)=>{  
        ele.addEventListener('click',
        function(event){ 
            event.stopPropagation() 
            if(isSelected == false ){ 
                isSelected = true
                ele.classList.add('selected') 
            }
            else if(isSelected == true){
                for (let i = 0; i < shape.length; i++) {
                    let element = shape[i];
                    if(element.classList.contains('selected')){
                        element.classList.remove('selected')
                    }
                }
                ele.classList.add('selected')
            }
            
        })
        
       
        
        ele.onmousedown  = function mousedownDrag(e){ 
          
            currentObj = ele
            var thisObj = document.querySelectorAll('.shape')[index]  

            let shiftX = e.clientX - thisObj.getBoundingClientRect().x 
            let shiftY = e.clientY - thisObj.getBoundingClientRect().top + 50  
        
            thisObj.style.position = 'absolute';
            // thisObj.style.zIndex = '1000'; 
        
            moveAt(e.pageX, e.pageY);
        
            //  moves the shape at (pageX, pageY) cordinates
            function moveAt(pageX,pageY){
                thisObj.style.left = pageX - shiftX + 'px'
                thisObj.style.top = pageY - shiftY + 'px'
            }
        
            function onMouseMove(e){
                if(!isResizing){
                    moveAt(e.pageX,e.pageY)
                }
                
            }
            // move the shape on mousemove
            document.addEventListener('mousemove',onMouseMove);
        
            // drop the shape,remove uneeded handlers
            thisObj.onmouseup = function(){
                document.removeEventListener('mousemove',onMouseMove);
                thisObj.onmouseup = null
                thisObj.style.zIndex = '0'; 
            }

            thisObj.ondragstart = function() {
                return false;
            };


        }
        ele.onmouseup = mouseup
        function mouseup() {
            
            window.removeEventListener("mouseup", mouseup);
          }
    }) 

      //  RESIZERS
      const resizers = document.querySelectorAll('.resizer');
      let currentResizer;

      for(let resizer of resizers){

          resizer.addEventListener('mousedown',mousedown);

          function mousedown(e){  
              currentResizer = e.target;
              isResizing = true

              let prevX = e.clientX;
              let prevY = e.clientY;

              window.addEventListener('mousemove',mousemove);
              window.addEventListener('mouseup',mouseup);
                 
                function mousemove(e){
                    
                    const thisObj = currentObj
                    const rect = thisObj.getBoundingClientRect();
                    if(e.shiftKey){
                        if(currentResizer.classList.contains('se')){
                            thisObj.style.width = rect.width - (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height - (prevY - e.clientY) + 'px';
                        }
                        else if(currentResizer.classList.contains('sw')){
                            thisObj.style.width = rect.width + (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height - (prevY - e.clientY) + 'px';
                            thisObj.style.left =  rect.left + (prevX - e.clientX) + 'px';
                            
                        }
                        else if(currentResizer.classList.contains('ne')){
                            thisObj.style.width = rect.width - (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height + (prevY - e.clientY) + 'px';
                            thisObj.style.top =  rect.top - (prevY - e.clientY) + 'px'
        
                        }
                        else if(currentResizer.classList.contains('nw')){
                            thisObj.style.width = rect.width + (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height + (prevY - e.clientY) + 'px';
                            thisObj.style.top =  rect.top - (prevY - e.clientY) + 'px'
                            thisObj.style.left =  rect.left - (prevX - e.clientX) + 'px'
                        }
    
                        prevX = e.clientX
                        prevY = e.clientY
                    }else{
                        if(currentResizer.classList.contains('se')){
                            thisObj.style.width = rect.width - (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height - (prevX - e.clientX) + 'px';
                        }
                        else if(currentResizer.classList.contains('sw')){
                            thisObj.style.width = rect.width + (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height - (prevY - e.clientY) + 'px';
                            thisObj.style.left =  rect.left - (prevX - e.clientX) + 'px';
                            
                        }
                        else if(currentResizer.classList.contains('ne')){
                            thisObj.style.width = rect.width - (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height + (prevY - e.clientY) + 'px';
                            thisObj.style.top =  rect.top - (prevY - e.clientY) + 'px'
                        }
                        else if(currentResizer.classList.contains('nw')){
                            thisObj.style.width = rect.width + (prevX - e.clientX) + 'px';
                            thisObj.style.height = rect.height + (prevY - e.clientY) + 'px';
                            thisObj.style.top =  rect.top - (prevY - e.clientY) + 'px'
                            thisObj.style.left =  rect.left - (prevX - e.clientX) + 'px'
                        }
    
                        prevX = e.clientX
                        prevY = e.clientY
                    }

                }

            function mouseup(){
                window.removeEventListener('mousemove',mousemove);
                window.removeEventListener('mousedown',mousedown);
                isResizing = false;
            }
        }
    }
}

function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
}


/////////////////////////////////////////////
new Sortable(layerContainer, {
  animation: 300
});


 
function displayOrder(){
    let drawingBoard1 ;
    drawingBoard1 = document.getElementById('drawing-board')  
        layerContainer.innerHTML = ''
        for (let i = 0; i < drawingBoard1.children.length; i++) {
            layerContainer.innerHTML+=`<div class='layers'>${drawingBoard1.children[i].getAttribute('id')}</div>`
        } 
}

function layersFunction(){
   let dbContainer = Array.from(drawingBoard.children)
    let layersArray = Array.from(layerContainer.children);
    layersArray.forEach((item)=>{
        item.addEventListener('drop',reOrder)
        item.addEventListener('touchend',reOrder)

        function reOrder(){
            let updatedlayersArray = Array.from(layerContainer.children)

            let newShapesArray =[]

            for (let i = 0; i < updatedlayersArray.length; i++) {
                newShapesArray.push( dbContainer.filter(item=>item.getAttribute('id') == updatedlayersArray[i].innerHTML))
            }
            console.log(newShapesArray);
            // drawingBoard.innerHTML = ''
            console.log(newShapesArray.shift()[0]);
             drawingBoard.appendChild(newShapesArray.shift()[0])
        }
    })
    dragDropResize() 
}



let fontFamilyBtn = document.getElementById('font-family');
fontFamilyBtn.addEventListener('change',(e)=>{
    console.log(e.target.value)
    if(isSelected){
         drawingBoard.children
         for (let i = 0; i < drawingBoard.children.length; i++) {
             if(drawingBoard.children[i].classList.contains('selected')){
                // console.log(drawingBoard.children[i].children[0].style.fontFamily )
                drawingBoard.children[i].children[0].style.fontFamily = e.target.value
             };
            
         }
    }
})

 
