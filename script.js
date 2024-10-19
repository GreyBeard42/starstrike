let health, level, kills, weapons, levelWait, sound, slow, shake
let doShake = true
let shootSound
let enemies = []
let notf = []
let powerups = []
let pQueue = []

function setup() {
  createCanvas(windowWidth, windowHeight*0.9)

  shootSound = new p5.Oscillator('sawtooth')
  shootSound.freq(100)

  sound = false
  health = 100
  level = 1
  kills = 0
  weapons = 0
  levelWait = 5
  slow = 0
  shake = new Shake()

  draw = tick

  let alert = {
    text: 'START!',
    time: frameCount
  }
  notf.push(alert)
}

// V actualy, draw V
function tick() {
  background('#313538')
  shake.update()
  if(doShake) translate(shake.x, shake.y)

  if(health <= 0) die()

  sounds()

  base()

  for(i = 0; i < powerups.length; i++) {
    item = powerups[i]

    powerUp(item.val, item.x, item.y)
  }

  if(round(random(1, 45+(min(slow, 8)+1))) == 1) addEnemy()

  enemyMove()

  levelUp()

  info()

  notfShow()

  attack()

  if(slow>0) slow -= 0.1
  
  let pqI = 0
  pQueue.forEach((e) => {
    if(dist(mouseX, mouseY, e.x, e.y) > width/10) {
      powerups.push(e)
      pQueue.splice(pqI)
    }
    pqI++
  })

  mouse(width/25)
}

function sounds() {
  if(sound) {
    if(shootSound.started == false) shootSound.start()
  } else {
    shootSound.stop()
  }
}

function soundToggle(e) {
  if(e.innerText == 'Sound OFF') {
    e.innerText = 'Sound ON'
    sound = true
  } else {
    e.innerText = 'Sound OFF'
    sound = false
  }
}

function notfShow() {
  let scale = width/35
  let y = 5-scale
  stroke('#a7b6c2')
  fill('#a7b6c2')
  strokeWeight(width/1300)
  textSize(scale)
  textAlign(RIGHT, TOP)
  for(i = 0; i < min(notf.length, 5); i++) {
    y += scale
    text(notf[i].text, width-5, y)
    if(frameCount - notf[i].time > 60*15) {
      notf.splice(i, 1)
    }
  }
}

function powerUp(type, x, y) {
  push()
  let scale = width/30*frameCount%10
  scale += width/15

  //rects
  if(type == 'Weapons') {
    fill('#7977e0')
  } else if(type == 'Health') {
    fill('#cb77e0')
  } else if(type == "Nuke") {
    fill('#a6db74')
  } else if(type == 'Slow') {
    fill('#f7c363')
  }
  noStroke()
  translate(x, y)
  rotate(frameCount/15)
  rect(0, 0, scale)
  rotate(frameCount/15+60)
  rect(0, 0, scale)
  rotate(frameCount/15+120)
  rect(0, 0, scale)

  //ellipse
  rotate(0)
  if(type == 'Weapons') {
    fill('#8a88eb')
  } else if(type == 'Health') {
    fill('#d88feb')
  } else if(type == 'Nuke') {
    fill('#b4e884')
  } else if(type == 'Slow') {
    fill('#f7c363')
  }
  ellipseMode(CENTER)
  ellipse(0, 0, scale)
  pop()
}

function base() {
  rectMode(CENTER)
  fill('#6ec4a5')
  noStroke()
  let scale = width/9
  rect(width/2, height/2, scale)
  ellipseMode(CENTER)
  fill('#9fe3ca')
  ellipse(width/2, height/2, scale)
}

function levelUp() {
  if(kills >= levelWait) {
    levelWait += min(levelWait*1.1, 10)
    level++

    let alert = {
      text: 'LEVEL UP',
      time: frameCount
    }
    notf.push(alert)
  }
}

function enemyMove() {
  for(i = 0; i < enemies.length; i++) {
    let item = enemies[i]
    if(item.health <= 0) {
      if(round(random(1, 10)) == 1) {
        let powerup = {}
        let id = round(random(1, 4))
        if(id == 1) {
          powerup.val = 'Weapons'
        } else if(id == 2) {
          powerup.val = 'Health'
        } else if(id == 3) {
          powerup.val = 'Nuke'
        } else if(id == 4) {
          powerup.val = 'Slow'
        }
        powerup.x = item.x
        powerup.y = item.y
        pQueue.push(powerup)
        //powerups.push(powerup)
      }

      if(enemies[i].x > width/2) shake.request(-width/60)
      else shake.request(width/60)
      enemies.splice(i, 1)
      kills++ 
      i = -1
      //Because after this i++
    } else {
      ellipseMode(CENTER)
      stroke('#d1613f')
      strokeWeight(width/300)
      fill('#e86f4a')
      ellipse(item.x, item.y, item.size, item.size)

      stroke('#d1613f')
      fill('#d1613f')
      strokeWeight(width/1100)
      let scale = width/45
      textSize(scale)
      let y
      if(item.y < item.size*0.8) {
        textAlign(CENTER, TOP)
        y = item.y+item.size/2+scale/2
      } else {
        textAlign(CENTER, BOTTOM)
        y = item.y-item.size/2-scale/2
      }
      text(item.health+'/'+item.dHealth, item.x, y)

      item.speed = max(700-level*50, 100)

      if(dist(width/2, height/2, item.x, item.y) < width/18+item.size/2) {
        health -= item.size/1500
      } else {
        item.x += ((width/2-item.x)/item.speed)/(min(slow, 8)+1)
        item.y += ((height/2-item.y)/item.speed)/(min(slow, 8)+1)
      }
    }
  }
}

function mouse(size) {
  ellipseMode(CENTER)
  noFill()
  //if(mouseIsPressed) {
    //stroke('#64b396')
  //} else {
    stroke('#7dc7ac')
  //}
  strokeWeight(size/10)
  ellipse(mouseX, mouseY, size, size)
  line(mouseX-size/2, mouseY, mouseX+size/2, mouseY)
  line(mouseX, mouseY-size/2, mouseX, mouseY+size/2)
}

function info() {
  let scale = width/45
  stroke('#a7b6c2')
  fill('#a7b6c2')
  strokeWeight(width/1500)
  textSize(scale)
  textAlign(LEFT, BOTTOM)
  text('HEALTH '+round(health)+'/100', 5, height-5)
  text('LEVEL '+level, 5, height-scale-5)
  text('KILLS '+kills, 5, height-(scale*2)-5)

  textAlign(RIGHT, BOTTOM)
  text('v1.2', width-5, height-5)
}

function addEnemy() {
  enemy = {}

  enemy.size = width/(random(12, 15)-min(level/5, 7))

  if(round(random(1,2)) == 1) {
    enemy.x = random(0-width*0.17, width*1.17)
    for(i = 0; i < enemies.length; i++) {
      let item = enemies[i]
      while(dist(enemy.x, 1, item.x, 1) < enemy.size) {
        enemy.x = random(0-width*0.17, width*1.17)
      }
    }
    if(round(random(1, 2,)) == 1) {
      enemy.y = 0-enemy.size/2
    } else {
      enemy.y = height+enemy.size/2
    }
  } else {
    enemy.y = random(0-height*0.17, height*1.17)
    for(i = 0; i < enemies.length; i++) {
      let item = enemies[i]
      while(dist(enemy.y, 1, item.y, 1) < enemy.size) {
        enemy.y = random(0-height*0.17, height*1.17)
      }
    }
    if(round(random(1, 2,)) == 1) {
      enemy.x = 0-enemy.size/2
    } else {
      enemy.x = width+enemy.size/2
    }
  }

  enemy.speed = 0
  enemy.dHealth = round(enemy.size/width*2000)
  enemy.health = enemy.dHealth
  enemies.push(enemy)
}

function attack() {
  //enemies
  for(i = 0; i < enemies.length; i++) {
    let distance = dist(mouseX, mouseY, enemies[i].x, enemies[i].y)
    if(distance < enemies[i].size/2) {
      enemies[i].health -= round(random(0, 3.5))+min(weapons, 10)
    }
  }

  //powerups
  for(i = 0; i < powerups.length; i++) {
    let distance = dist(mouseX, mouseY, powerups[i].x, powerups[i].y) 
    if(distance < width/30) {
      let message = powerups[i].val+' boost!'
      let alert = {
        time: frameCount
      }

      if(powerups[i].val == 'Nuke') {
        alert.text = 'Nuke Exploded!'
      } else if(powerups[i].val == 'Slow') {
        alert.text = 'Slow-Mo Activated!'
      } else {
        alert.text = message
      }

      notf.push(alert)

      if(powerups[i].val == 'Health') {
        health = 100
      } else if(powerups[i].val == 'Weapons') {
        weapons += 1
      } else if(powerups[i].val == "Nuke") {
        enemies = []
        if(powerups[i].x > width/2) shake.request(-width/20)
        else shake.request(width/20)
      } else if(powerups[i].val == 'Slow') {
        slow = 100
      }

      powerups.splice(i, 1)
    }
  }
}

function die() {
  draw = die
  shootSound.stop()
  background('#313538')
  stroke('#a7b6c2')
  fill('#a7b6c2')
  textSize(width/10)
  strokeWeight(width/250)
  textAlign(CENTER, BOTTOM)
  text('YOU DIED', width/2, height/2)
  textAlign(CENTER, TOP)
  textSize(width/14)
  strokeWeight(width/350)
  text('Level '+level+' - '+kills+' Kills', width/2, height/2)
}

function lol() {
  shootSound.stop()
  background('#313538')
  stroke('#a7b6c2')
  fill('#a7b6c2')
  textAlign(CENTER, CENTER)
  textSize(width/14)
  strokeWeight(width/350)
  text('Paused', width/2, height/2)
}

function keyPressed() {
  if(keyCode == 32) pause()
}

function pause() {
  if(draw != die) {
    let e = document.getElementById('pause')
    if(draw != lol) {
      draw = lol
      e.innerText = 'Unpause'
    } else {
      draw = tick
      e.innerText = 'Pause'
    }
  }
}

function shakeToggle() {
  if(doShake) {
    doShake = false
    document.getElementById('shake').innerText = 'ScreenShake OFF'
  } else {
    doShake = true
    document.getElementById('shake').innerText = 'ScreenShake ON'
  }
}

class Shake {
  constructor() {
    this.x = 0
    this.y = 0
    this.xvel = 0
    this.time = 0
    this.step = 0
    this.target = 0
  }
  request(x=-width/50, frames=abs(x/20)+1) {
    if(round(this.x) == 0) this.shake(x, frames)
  }
  shake(x, frames) {
    this.step = 1
    this.target = x
    this.xvel = x/frames
  }
  update() {
    this.x += this.xvel
    if(this.step == 1 && abs(this.target-this.x) < width/100) this.step = 2
    if(this.step == 2) this.xvel = (this.target-this.x)/3

    if(this.step == 2 && round(this.x) == round(this.target)) this.step = 0
    if(this.step == 0) {
        this.target = 0
        this.xvel = (this.target-this.x)/3
    }
  }
}