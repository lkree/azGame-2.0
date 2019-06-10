'use strict';

(function() {
  for (let i=1;i<=75;++i) {
    let world = document.querySelector('.world-wrapper'),
        stepCircle = document.createElement('div'),
        p = document.createElement('p');

    stepCircle.id = `c${i}`;
    p.textContent = `${i}`;
    stepCircle.appendChild(p);
    stepCircle.classList.add('step-circle');

    world.appendChild(stepCircle);
  }

  let player1 = document.createElement('div'),
      player2 = document.createElement('div');

  player1.id = 'teamOne';
  player2.id = 'teamTwo';

  document.getElementById('c1').appendChild(player1);
  document.getElementById('c1').appendChild(player2);
})();

let game = {
  progressTeamOne: 1,
  progressTeamTwo: 1,
  rollNumber: 0,

  questionOutput: function() {
    function randomQuestion() {
      return Math.floor(Math.random() * window.questions.length);
    }

    return window.questions.splice(randomQuestion(), 1);
  },

  randomRoll: function() {
    return Math.floor((Math.random() * 6) + 1);
  },

  step: function(evt) {
    game.rollNumber = game.randomRoll();
    let question = game.questionOutput();

    alert(`Вам выпало: ${game.rollNumber}`);

    let popup = document.querySelector('.popup'),
        world = document.querySelector('.world-wrapper'),
        wrongBtn = document.querySelector('#wrongBtn'),
        rightBtn = document.querySelector('#rightBtn'),
        popupQuestion = document.querySelector('.popup__question'),
        closeAll = document.querySelector('.closeAll'),
        onequestion;

    if (evt.target === document.querySelector('.stepBtnTeamOne')) {
      rightBtn.dataset.team = `${1}`;
    }
    if (evt.target === document.querySelector('.stepBtnTeamTwo')) {
      rightBtn.dataset.team = `${2}`;
    }

    wrongBtn.addEventListener('click', game.closePopup);
    rightBtn.addEventListener('click', game.movePlayer);

    world.setAttribute('style', 'filter: grayscale(1)');

    (function(){ //questionCreater
      for (onequestion of question[0]) {
        let text = document.createElement('p');
        text.textContent = onequestion;
        popupQuestion.appendChild(text);
      }
    })();

    closeAll.style.display = 'block';
    popup.setAttribute('style', 'display: flex');
  },

  alertStatuses: {
    7:[
      7, 2, true
    ],
    12:[
      12, 16, false
    ],
    19:[
      19, 24, false
    ],
    46:[
      46, 35, true
    ],
    55:[
      55, 59, false
    ],
    63:[
      63, 50, true
    ],
    65:[
      65, 69, false
    ]
  },
    
  movePlayer: function() {
    let activateBtn = document.querySelector('#rightBtn'),
        popupQuestion = document.querySelector('.popup__question'),
        closeAll = document.querySelector('.closeAll'),
        status;

    if (+(activateBtn.dataset.team) === 1) {
      try {
        let initialDiv = document.getElementById(`c${game.progressTeamOne}`);
        game.progressTeamOne += game.rollNumber;
        let player = document.querySelector('#teamOne');
        player = initialDiv.removeChild(player);
        document.getElementById(`c${game.progressTeamOne}`).appendChild(player);
      } catch(e) {
        console.log(e.message)
      }
    }
    if (+(activateBtn.dataset.team) === 2) {
      try {
        let initialDiv = document.getElementById(`c${game.progressTeamTwo}`);
        game.progressTeamTwo += game.rollNumber;
        let player = document.querySelector('#teamTwo');
        player = initialDiv.removeChild(player);
        document.getElementById(`c${game.progressTeamTwo}`).appendChild(player);
      } catch(e) {
        console.log(e.message)
      }
    }

    popupQuestion.innerHTML = '';
    closeAll.style.display = 'none';


    game.rollNumber = 0;

    if (game.progressTeamOne >= 75) {
      alert(`Победила команда работников!`);
      location.reload();
    }

    if (game.progressTeamTwo >= 75) {
      alert(`Победила команда работодателей!`);
      location.reload();
    }

    game.closePopup();

    setTimeout(function() {
      for (status in game.alertStatuses) {
        if (game.progressTeamOne == status || game.progressTeamTwo == status)
        {
          game.alertMoveTeam(game.alertStatuses[status][0], game.alertStatuses[status][1], activateBtn.dataset.team, game.alertStatuses[status][2]);
        }
      }
    }, 2000);
  },

  alertMoveTeam: function(from, to, teamNumber, remove) {
    let teamOne = document.querySelector('#teamOne'),
        teamTwo = document.querySelector('#teamTwo'),
        decreaseNumber = 0;

    remove ? decreaseNumber = from - to : decreaseNumber = to - from;

    if (remove) {
      teamNumber == 1 ?
      game.progressTeamOne -= decreaseNumber : 
      game.progressTeamTwo -= decreaseNumber;
    } else {
      teamNumber == 1 ? 
      game.progressTeamOne += decreaseNumber : 
      game.progressTeamTwo += decreaseNumber;
    }

    let fromDiv = document.querySelector(`#c${from}`),
        player;
    let toDiv = document.querySelector(`#c${to}`);

    player = fromDiv.removeChild(teamNumber == 1 ? teamOne : teamTwo);

    toDiv.appendChild(player);
  },

  closePopup: function () {
    let popup = document.querySelector('.popup'),
        world = document.querySelector('.world-wrapper'),
        closeAll = document.querySelector('.closeAll'),
        popupQuestion = document.querySelector('.popup__question');

    world.removeAttribute('style');
    popup.removeAttribute('style');
    closeAll.style.display = 'none';
    popupQuestion.innerHTML = '';
  }
};
(function(){
  let stepBtnTeamOne = document.querySelector('.stepBtnTeamOne'),
      stepBtnTeamTwo = document.querySelector('.stepBtnTeamTwo'),
      startButton = document.querySelector('.startup__startLink'),
      startScreen = document.querySelector('.startup'),
      playground = document.querySelector('.world-wrapper'),
      rules = document.querySelector('.rules'),
      rulesSubmitBtn = document.querySelector('.rules__submit');

  startButton.addEventListener('click', function() {
    startScreen.classList.add('hidden');
    rules.classList.remove('hidden');
  });
  
  rulesSubmitBtn.addEventListener('click', (evt) => {
    rules.classList.add('hidden');
    playground.classList.remove('hidden');
  });

  stepBtnTeamOne.addEventListener('click', game.step);
  stepBtnTeamTwo.addEventListener('click', game.step);
})();