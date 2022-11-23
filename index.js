import birdsData from "./birds.js"

const body = document.querySelector('body')
const headerBtn = document.querySelector('.return-play') // btn for transition - page-1, page-2
const score = document.querySelector('.score')
const scoreRes = document.querySelector('.score-res')
const headerBtnName = document.querySelector('.return-play') // span-element for exchange name of button
const mainScreen = document.querySelector('.main-block')
const soundBtn = document.querySelector('.sound-btn')
const video = document.querySelector('video')
const taskBirdsNames = document.querySelectorAll('.answer li span')
const taskBirdsNamesMarkers = document.querySelectorAll('.answer li')
const taskSelection = document.querySelector('.page-2_nav')
const nextBtn = document.querySelector('.main-btn')


let indexBirdsData, checkPoint = 5,nameBird, flagCross,
objectAnswer = {
    guess: '',
    answer:''
}

console.dir(document.querySelectorAll('.page-2_nav li'))

preloadImg()

// 1.header

// 1.1 header - header-btn
score.classList.toggle('invisible')
scoreRes.classList.toggle('invisible')

headerBtn.addEventListener('click', ()=>{    
    
    if(!mainScreen.classList.contains('view-3')){

        selectName()
        mainScreen.classList.toggle('view-2')

        if(mainScreen.classList.contains('view-2')){

            headerBtnName.innerHTML = 'return'
            score.classList.toggle('invisible')
            scoreRes.classList.toggle('invisible')
            
            if (soundBtn.classList.contains('sound-btn_active')){
            
                video.muted = true            
                soundBtn.classList.toggle('sound-btn_active')
                soundBtn.classList.toggle('sound-btn_stop')
            }
        } else{

            headerBtnName.innerHTML = 'play'
            score.classList.toggle('invisible')
            scoreRes.classList.toggle('invisible')

            video.muted = false
            soundBtn.classList.toggle('sound-btn_stop')          
            soundBtn.classList.toggle('sound-btn_active')      

            
        }

    } else {
        mainScreen.classList.toggle('view-3')
        headerBtnName.innerHTML = 'return'
        indexBirdsData = 1

        removeTrueAnswer()
        removeDescribeAnswer()
        checkMarkerClass()
        selectName(indexBirdsData)

        scoreRes.textContent = 0

    }

    
})

// main

// 2.1 main - sound-btn
soundBtn.classList.toggle('sound-btn_stop')
soundBtn.addEventListener('click', ()=>{

    soundBtn.classList.toggle('sound-btn_stop')
    soundBtn.classList.toggle('sound-btn_active')    

    if (soundBtn.classList.contains('sound-btn_active')){
        video.muted = false
    } else {
        video.muted = true
    }
})

// 2.2 write names of birds

    // получаем название группы птиц по кнопке
taskSelection.addEventListener('click', (event)=>{ 
        
        switch(event.target.textContent){
            case 'Разминка':
                indexBirdsData = 0
                break
            case 'Воробьиные':
                indexBirdsData = 1
                break
            case 'Лесные птицы':
                indexBirdsData = 2
                break
            case 'Певчие птицы':
                indexBirdsData = 3
                break
            case 'Хищные птицы':
                indexBirdsData = 4
                break
            case 'Морские птицы':
                indexBirdsData = 5
                break
            default:                
                return
        }    
        selectName(indexBirdsData)
        checkMarkerClass()
})


// HELP-FUNCTION

// block answer
    // по кнопке в меню, выводим название птиц вблоке задание
function selectName(index = 0){        
        birdsData[index].forEach((el, i)=>{
            taskBirdsNames[i].textContent = el.name
        })
        if(!index){
            indexBirdsData = 0
        }
        removeTrueAnswer()
        removeDescribeAnswer()
        guessBird(indexBirdsData)

        // decorateNavBtn()
}
// стилизуем кнопку выбранной категории птиц
// function decorateNavBtn(){

//     document.querySelectorAll('.page-2_nav li').forEach(el =>{
//         if(el.classList.contains('active-li')){
//             el.classList.remove('active-li')
//         }
//     })

//     document.querySelectorAll('.page-2_nav li')[indexBirdsData].classList.add('active-li')
// }

taskBirdsNames.forEach(el =>{
    
    el.addEventListener('click',(event)=>{
        
        nameBird = event.target.textContent

        birdsData[indexBirdsData].forEach((el, i) =>{

            if(el.name === nameBird){
                const index = i
                descriptionBird(index)
            }
            
        })
    })    
})

// block description
function descriptionBird(i){

    const describeName = document.querySelector('.describe-bird h2')
    describeName.textContent = `${birdsData[indexBirdsData][i].name}` + '/' + `${birdsData[indexBirdsData][i].species}`   
    
    const describeImg = document.querySelector('.describe-bird img')

    if(`${birdsData[indexBirdsData][i].name}` === 'Пеликан'){
        describeImg.src = './assets/img/pelican.jpg'
    } else {
        describeImg.src = `${birdsData[indexBirdsData][i].image}`
    }

    const describeText = document.querySelector('.describe-bird p')    
    describeText.textContent = `${birdsData[indexBirdsData][i].description}`

    const describeAudio = document.querySelector('.describe-bird audio')
    describeAudio.src = `${birdsData[indexBirdsData][i].audio}`

    objectAnswer.answer = `${birdsData[indexBirdsData][i].name}`

    isTrueAnswer(describeName.textContent, describeImg.src)
}

// fullscreen

function toggleScreen(){
    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen()
    } else{
        if(document.fullscreenEnabled){
            document.exitFullscreen()
        }
    }
}

function escapeFullscreen(){
    document.addEventListener('keydown', (event)=>{
        if(event.key === 'Escape'){
            toggleScreen()
        }
    })
}

escapeFullscreen()
//  Предзагрузка изображений

function preloadImg(){
    let imgArr =[]
    for(let i = 0; i < birdsData.length; i++){
        for (let j =0; j < birdsData[i].length; j++){
            const img = new Image()
            img.src = `${birdsData[i][j].image}`
            img.onload = () => imgArr.push(img.src)
        }
    }
}
// загадываем птицу
function guessBird(i){
    const guessBird = randomBirds(i) // получили птицу, которую нужно загадать
    console.log(guessBird)
    const taskAudio = document.querySelector('.task-block audio')
    taskAudio.src = `${guessBird.audio}`

    objectAnswer.guess = guessBird.name
}

// рандомно выбираем из массива
function randomBirds(i){
    const shuffleArr = birdsData[i]
    const numberArr = [0, 1, 2, 3, 4, 5]
    shuffleArr.sort(()=> Math.random() - 0.5)
    numberArr.sort(()=> Math.random() - 0.5)
    return shuffleArr[numberArr[0]]
}

// проверка ответа, если правильно выводим название и фото
function isTrueAnswer(nameTitle, linkImg){    
    
    if(flagCross){
        return
    }

    
    if(objectAnswer.guess == objectAnswer.answer){
        
        taskBirdsNamesMarkers.forEach(el =>{

            if(el.classList.contains('trueAnswer')){     //от повторного нажатия
                return
            }
            
            if(el.firstElementChild.innerText == objectAnswer.answer){
                el.classList.add('trueAnswer')               
                document.querySelector('.task-block h2').textContent = nameTitle
                document.querySelector('.task-block img').src = linkImg                
                
                fixScore()  
                isWin()              
            }
            return
        })       
        
    } else{
        taskBirdsNamesMarkers.forEach(el =>{

            if(el.classList.contains('falseAnswer')){           //от повторного нажатия
                return
            }

            if(el.firstElementChild.innerText == objectAnswer.answer){
                el.classList.add('falseAnswer')
                
                checkPoint--
            }
        })
    }   
}
// убираем цвет а маркерах
function checkMarkerClass(){
    
    taskBirdsNamesMarkers.forEach(el =>{
        
        if(el.classList.contains('trueAnswer')){
            el.classList.remove('trueAnswer')
        }
        if(el.classList.contains('falseAnswer')){
            el.classList.remove('falseAnswer')
        }
    })
}

// обнуляем блок птицы, которую загадали

function removeTrueAnswer(){
    
    document.querySelector('.task-block h2').textContent = '******'
    document.querySelector('.task-block img').src = './assets/svg/logo.svg'
}

// обнуляем блок describe
function removeDescribeAnswer(){
    document.querySelector('.describe-bird h2').textContent = 'nameBird'
    document.querySelector('.describe-bird p').textContent = 'Description Bird'
    document.querySelector('.describe-bird img').src = './assets/svg/logo.svg'
}

// переход на следующий уровень
nextBtn.addEventListener('click', ()=>{
    if(flagCross == true && indexBirdsData !== 5){
        nextLevel()
    }
})

// переход на следующий уровень + обнуление
function nextLevel(){

    indexBirdsData++
    flagCross = false
    
    removeTrueAnswer()
    removeDescribeAnswer()
    checkMarkerClass()
    selectName(indexBirdsData)

}

// вывод/изменение счёта на страницу
function fixScore(){

    if(indexBirdsData){
        let resNumber = Number(scoreRes.textContent)
        resNumber += (checkPoint >= 0) ? checkPoint : 0;
        scoreRes.textContent = resNumber  
    }

    checkPoint = 5  
    flagCross = true
}

// проверка на победу
function isWin(){
    if(flagCross == true && indexBirdsData == 5){
        winPage()
    }
}
// вывод поздравления
function winPage(){    

    let congratulation
    
    if(Number(scoreRes.textContent) == 25){
        congratulation = 'Excellent !'
    }

    if(Number(scoreRes.textContent) < 25 && Number(scoreRes.textContent) >= 20){
        congratulation = 'Very Good !'
    } 
     
    if(Number(scoreRes.textContent) < 20 && Number(scoreRes.textContent) >= 15){
        congratulation = 'Good Result !'
    }
    
    if(Number(scoreRes.textContent) < 15){
        congratulation = 'Try again, I belive in you !'
    }

    document.querySelector('.page-3 h2').textContent = `Your score : ${scoreRes.textContent}` 
    document.querySelector('.page-3 p').textContent = congratulation

    

    setTimeout(()=>{
        stopSound()
        mainScreen.classList.toggle('view-3')   
        headerBtnName.innerHTML = 'play again'     
    }, 2000)
    
}

function stopSound(){
    const audioPlayers = document.querySelectorAll('audio')

    audioPlayers.forEach(el =>{
        el.src = ''
    })
}