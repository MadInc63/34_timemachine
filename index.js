var timeout_in_secs = 3 * 60;
var alert_timeout_in_secs = 30;
var template = '<h1><span class="js-timer-minutes">00</span>:<span class="js-timer-seconds">00</span></h1>';
var alert_message = ["Неудача – это просто возможность начать снова, но уже более мудро. © Генри Форд",
  "Если проблему можно разрешить, не стоит о ней беспокоиться. Если проблема неразрешима, беспокоиться о ней бессмысленно. © Далай Лама",
  "Даже если вы очень талантливы и прилагаете большие усилия, для некоторых результатов просто требуется время: вы не получите ребенка через месяц, даже если заставите забеременеть девять женщин. © Уоррен Баффет",
  "Раз в жизни фортуна стучится в дверь каждого человека, но человек в это время нередко сидит в ближайшей пивной и никакого стука не слышит. © Марк Твен",
  "Наш большой недостаток в том, что мы слишком быстро опускаем руки. Наиболее верный путь к успеху – все время пробовать еще один раз. © Томас Эдисон",
  "Лично я люблю землянику со сливками, но рыба почему-то предпочитает червяков. Вот почему, когда я иду на рыбалку, я думаю не о том, что люблю я, а о том, что любит рыба. © Дейл Карнеги",
  "Просыпаясь утром, спроси себя: «Что я должен сделать?» Вечером, прежде чем заснуть: «Что я сделал?». © Пифагор",
  "Бедный, неудачный, несчастливый и нездоровый это тот, кто часто использует слово «завтра». © Роберт Кийосаки",
  "Старики всегда советуют молодым экономить деньги. Это плохой совет. Не копите пятаки. Вкладывайте в себя. Я в жизни не сэкономил и доллара, пока не достиг сорока лет. © Генри Форд",
  "Я этого хочу. Значит, это будет. © Генри Форд",
  "Я не терпел поражений. Я просто нашёл 10 000 способов, которые не работают. © Томас Эдисон",
  "Раньше я говорил: «Я надеюсь, что все изменится». Затем я понял, что существует единственный способ, чтобы все изменилось— измениться мне самому. © Джим Рон",
  "Урок, который я извлек и которому следую всю жизнь, состоял в том, что надо пытаться, и пытаться, и опять пытаться – но никогда не сдаваться! © Ричард Бренсон"];

function padZero(number){
  return ("00" + String(number)).slice(-2);
}

class Timer{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  constructor(timeout_in_secs){
    this.initial_timeout_in_secs = timeout_in_secs
    this.reset()
  }
  setSecsLeft(timeout_in_secs) {
    this.initial_timeout_in_secs = timeout_in_secs
    this.timeout_in_secs = this.initial_timeout_in_secs
    this.timestampOnStart = this.getTimestampInSecs()
  }
  getTimestampInSecs(){
    var timestampInMilliseconds = new Date().getTime()
    return Math.round(timestampInMilliseconds/1000)
  }
  start(){
    if (this.isRunning)
      return
    this.timestampOnStart = this.getTimestampInSecs()
    this.isRunning = true
  }
  stop(){
    if (!this.isRunning)
      return
    this.timeout_in_secs = this.calculateSecsLeft()
    this.timestampOnStart = null
    this.isRunning = false
  }
  reset(timeout_in_secs){
    this.isRunning = false
    this.timestampOnStart = null
    this.timeout_in_secs = this.initial_timeout_in_secs
  }
  calculateSecsLeft(){
    if (!this.isRunning)
      return this.timeout_in_secs
    var currentTimestamp = this.getTimestampInSecs()
    var secsGone = currentTimestamp - this.timestampOnStart
    return Math.max(this.timeout_in_secs - secsGone, 0)
  }
}

class TimerWidget{
  // IE does not support new style classes yet
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  construct(){
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
  mount(rootTag){
    if (this.timerContainer)
      this.unmount()

    // adds HTML tag to current page
    this.timerContainer = document.createElement('div')

    this.timerContainer.setAttribute("style", "height: 70px;top: 10px;left: 10px;position: fixed;z-index: 9999;margin-left: 0px;padding-left: 10px;padding-right: 10px;background-color: #00000060;color: white;text-shadow: 0 0 20px black;")
    this.timerContainer.innerHTML = template

    rootTag.insertBefore(this.timerContainer, rootTag.firstChild)

    this.minutes_element = this.timerContainer.getElementsByClassName('js-timer-minutes')[0]
    this.seconds_element = this.timerContainer.getElementsByClassName('js-timer-seconds')[0]
  }
  update(secsLeft){
    var minutes = Math.floor(secsLeft / 60);
    var seconds = secsLeft - minutes * 60;

    this.minutes_element.innerHTML = padZero(minutes)
    this.seconds_element.innerHTML = padZero(seconds)
  }
  unmount(){
    if (!this.timerContainer)
      return
    this.timerContainer.remove()
    this.timerContainer = this.minutes_element = this.seconds_element = null
  }
}

function randomNumberFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function alertMessage() {
  var randomMessage = alert_message[randomNumberFromInterval(0, alert_message.length)]
  alert(randomMessage)
}

function main(){

  var timer = new Timer(timeout_in_secs)
  var timerWiget = new TimerWidget()
  var intervalId = null

  timerWiget.mount(document.body)

  function handleIntervalTick(){
    var secsLeft = timer.calculateSecsLeft()
    timerWiget.update(secsLeft)
    if (secsLeft <= 0) {
        alertMessage()
        timer.setSecsLeft(alert_timeout_in_secs)
    }
  }

  function handleVisibilityChange(){
    if (document.hidden) {
      timer.stop()
      clearInterval(intervalId)
      intervalId = null
    } else {
      timer.start()
      intervalId = intervalId || setInterval(handleIntervalTick, 300)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener("visibilitychange", handleVisibilityChange, false);
  handleVisibilityChange()
}

// initialize timer when page ready for presentation
window.addEventListener('load', main)
