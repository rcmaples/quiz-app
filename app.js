'use strict';

/*
Generally, invoking a global variable should be avoided. However,
I need multiple functions to reference which question we're on.
`whichQuestion` will be used to denote progress and score, as well as loading
the proper question and answer set into the game itself.
`correctAnswerKey` is used to determine which answer is correct for styling and
tracking results
`numberCorrect` stores the number of times someone chose the correct answer. This
gets used when displaying the score (in plain english numbercorrect * 10, though
it's coded slightly different than that.
*/

let whichQuestion = 0;
let correctAnswerKey =0;
const incorrectAnswerKey =[];
let numberCorrect = 0;
//let qli = 0;


/*
 The quiz app starts with the first `section` unhidden and
 the subsequent `sections` hidden. `startGame()` is called
 when launching the game (#js-quiz-state.submit). It hides
 the initial section adding class .js-hidden and unhides the game
 section by removing the .js-hidden class from the quiz section.
 */
function startGame(){

	whichQuestion = 0;
	correctAnswerKey=0;
	numberCorrect=0;
	incorrectAnswerKey.length = 0;
	//console.log('startGame Ran');
	$('#js-quiz-start').submit(function(event){
		event.preventDefault();
		if (whichQuestion === 0){
		questionImageLoader(whichQuestion);
		}
		// hide the start page
		$('.js-start-unhidden').removeClass('js-start-unhidden').addClass('js-start-hidden');
		//unhide the questions page
		$('.js-questions-hidden').removeClass('js-questions-hidden').addClass('js-questions-unhidden');
		//$('.js-unhidden').removeClass('js-unhidden').addClass('js-hidden');

	});

}


/*
Upon launch/restart/refresh/answer submit `resetAnswers()`
removes classes .js-correct-answer and .js-incorrect-answer
from the answer buttons. These classes are used to style the
buttons to provide feedback to the user. The intial html loads
with these classes set on two buttons to check styling. By calling
the function on page ready, they are reset as expected. For style
debugging comment out the function call below.
*/
function resetAnswers(){

	$('#js-quiz-answers').find("button")
	.removeClass("js-correct-answer js-incorrect-answer");
	//console.log("resetAnswers has run.");
}

/*
`randomizeAnswers()` is responsible to changing the order
the wrong answers on each load. This ensures that the answers are
in a different order with each play through.
*/
function randomizeAnswers(){
	//console.log(`The lenght of the incorrectAnswerKeyis: ${incorrectAnswerKey.length}`);
	correctAnswerKey = Math.floor(Math.random()*4)+1;
	let nextNum = 0;

	incorrectAnswerKey.length = 0;

	while (incorrectAnswerKey.length <3 ){
		nextNum = (Math.floor(Math.random()*4)+1);
		if (nextNum != correctAnswerKey && !incorrectAnswerKey.includes(nextNum)) {
			incorrectAnswerKey.push(nextNum);
		}
	}

	questionLoader(store[0].results);
	//console.log(`the correctAnswerKey is: ${correctAnswerKey}`); // writes the correct answer to the console for sanith checks.
	//console.log(`the incorrectAnswerKey is: ${incorrectAnswerKey}`);
	//console.log(incorrectAnswerKey);
}

/*
`questionLoader()` is used to load the question content into
.questionBlock and to assign answers to the form buttons.
`correctAnswerKey` is a random number between 1 and 4 (inclusive).
The key value is used to randomly assign the correct answer to
one of the buttons. This allows for the answers to be in different
order through each run through.
*/
function questionLoader(questions){

	//qli++;
	//console.log(`questionLoader Ran ${qli} times`);
	adjustProgress();
	// console.log(`question number: ${whichQuestion}`); // writes the current question number to the console for sanity checks.
	//console.log(correctAnswerKey);
	//console.log(incorrectAnswerKey);

	let getQuestion = questions[whichQuestion].question;
	let getCorrectAnswer = ""; // Init a string to store the correct answer
	const getIncorrectAnswers = [];

	getIncorrectAnswers.push(questions[whichQuestion].incorrect_answers);

	getCorrectAnswer = questions[whichQuestion].correct_answer;
	//console.log(getIncorrectAnswers);
	//console.log(incorrectAnswerKey.length);

	$('.questionBlock').html(`<legend>${getQuestion}</legend>`); // load the question into the content
	$(`#js-quiz-answers [data-label=${correctAnswerKey}]`)
		.addClass('js-correct-answer')
		.attr("data-correctanswer", "true")
		.html(getCorrectAnswer); // Load the correct answer


	for (let i = 0; i<incorrectAnswerKey.length; i++){
		$(`#js-quiz-answers [data-label=${incorrectAnswerKey[i]}]`)
			.addClass('js-incorrect-answer')
			.attr("data-correctanswer", "false")
			.html(getIncorrectAnswers[0][i]); // Load the incorrect answers
	}
	//submitAnswers();
	if (whichQuestion !== 0){
		questionImageLoader(whichQuestion);
	}
	// Flag the answers on the last question so we know when to end the game.
	if (whichQuestion === 9) {
		//console.log("last question!");
		$('#js-quiz-answers').find('button').attr("lastQuestion","");
	}
}

function questionImageLoader(qnum){

	if (qnum === 0){
		$('.questionIcon').html(`<img alt="A line drawing of Jupiter" src="./images/jupiter.svg">`);
	} else if (qnum === 1){
		$('.questionIcon').html(`<img alt="A line drawing of a 3 headed hydra" src="./images/hydra.svg">`);
	} else if (qnum === 2){
		$('.questionIcon').html(`<img alt="A line drawing of Juno." src="./images/juno.svg">`);
	} else if (qnum === 3){
		$('.questionIcon').html(`<img alt="Sillhouette of some muses" src="./images/muses.svg">`);
	} else if (qnum === 4){
		$('.questionIcon').html(`<img alt="A line drawing of a mermaid" src="./images/mermaid.svg">`);
	} else if (qnum === 5){
		$('.questionIcon').html(`<img alt="A line drawing of a bull's head" src="./images/taurus.svg">`);
	} else if (qnum === 6){
		$('.questionIcon').html(`<img alt="A line drawing of a trojan horse" src="./images/trojanhorse.svg">`);
	} else if (qnum === 7){
		$('.questionIcon').html(`<img alt="A line drawing of a centaur" src="./images/centaur.svg">`);
	} else if (qnum === 8){
		$('.questionIcon').html(`<img alt="A line drawing of a minotaur" src="./images/minotaur.svg">`);
	} else if (qnum === 9){
		$('.questionIcon').html(`<img alt="A line drawing of a pegasus" src="./images/pegasus.svg">`);
	}
}


/*
On Modal Close, move on to the next question. This forces the user to move on
to the next question without being able to change their answer or go back to
the same question. As with the Form Submission Handlers below, this handler is
not wrapped in it's own function.
*/


	$('.modal').on('click', '[rel="modal:close"]', function(event){
		$('.js-questions-hidden').removeClass('js-questions-hidden').addClass('js-questions-unhidden');


		if ($(this).parent().hasClass('js-modal-lastQuestion')) {
			return;
		} else {
		//if (
		whichQuestion++;
		//console.log(`next question number: ${whichQuestion}`);
		resetAnswers();
		randomizeAnswers();
		}

	});




/*
Form Submission Handlers
- by default, prevent default behavior on all buttons.
*/

	$('#js-quiz-restart').submit(function(event){
		//console.log("RESTART");
		event.preventDefault();
		resetGame();
	});

	$('#js-quiz-answers').submit(function(event){
		event.preventDefault(); // default 'submit' behavior is to be avoided here.
	});

	/*
	if someone clicks on the answer with a class of `.js-correct-answer`,
	increment the score, display the 'correct-answer' modal
	*/
	$(document).on('click', '.js-correct-answer', function(event) {
		event.preventDefault();
		incrementScore();
		//console.log("SCORE!");
		/* Is this the last question? If so, tag the modal. */
		if ($(this)[0].hasAttribute("lastQuestion")) {



			$('.js-correct-answer-modal')
				.addClass('js-modal-lastQuestion')
				.removeClass('js-modal-notTheLastQuestion')
				.html(`<p>Good Job!</p><a href="#close-modal" tabIndex="0" rel="modal:close">End Game</a>`)
				.modal({escapeClose: false, clickClose: false});
				$('.js-questions-unhidden').removeClass('js-questions-unhidden').addClass('js-questions-hidden');
		} else {
			$('.js-correct-answer-modal')
				.html(`<p>Good Job!</p><a href="#close-modal" tabIndex="0" rel="modal:close">Next Question</a>`)
				.modal({escapeClose: false, clickClose: false});
			$('.js-questions-unhidden').removeClass('js-questions-unhidden').addClass('js-questions-hidden');
		}
		return false;
	});

	/*
	if the user clicks on an answer with a class of `.js-incorrect-answer`,
	display the 'incorrect-answer' modal.
	*/
	$(document).on('click', '.js-incorrect-answer', function(event) {
		event.preventDefault();

		/* Is this the last question? If so, tag the modal. */
		if($(this)[0].hasAttribute("lastQuestion")){

			$('.js-incorrect-answer-modal')
				.addClass('js-modal-lastQuestion')
				.removeClass('js-modal-notTheLastQuestion')
				.html(`<p>Sorry!</p>
						<p>The answer we were looking for was ${store[0].results[whichQuestion].correct_answer}.</p>
						<a href="#close-modal" tabIndex="0" rel="modal:close">End Game</a>`)
				.modal({escapeClose: false, clickClose: false});
				$('.js-questions-unhidden').removeClass('js-questions-unhidden').addClass('js-questions-hidden');

		} else {
			$('.js-incorrect-answer-modal')
				.html(`<p>Sorry!</p>
						<p>The answer we were looking for was ${store[0].results[whichQuestion].correct_answer}.</p>
						<a href="#close-modal" tabIndex="0" rel="modal:close">Next Question</a>`)
				.modal({escapeClose: false, clickClose: false});
				$('.js-questions-unhidden').removeClass('js-questions-unhidden').addClass('js-questions-hidden');
		}
		return false;
	});

	/*
	When we hit the last question we need to hide the questions again and
	display the end game screen. This screen will need to display a message
	depending on player's score.
	*/
	$(document).on('click', '.js-modal-lastQuestion', function(event){
		//event.stopPropagation();
		//alert('game over');
		event.preventDefault();
		//$('.js-hidden').toggleClass('js-hidden');
		$('.js-questions-unhidden').removeClass('js-questions-unhidden').addClass('js-questions-hidden');
		$('.js-results-hidden').removeClass('js-results-hidden').addClass('js-results-unhidden');
		$('.js-correct-answer-modal').removeClass('js-modal-lastQuestion').addClass('js-modal-notTheLastQuestion');
		$('.js-incorrect-answer-modal').removeClass('js-modal-lastQuestion').addClass('js-modal-notTheLastQuestion');
		displayResults(numberCorrect);  // function to update text in results page based on score.

	});

/* END FORM SUBMISSION HANDLERS */



/*
The following functions increment the progress bar and scrore.
I chose to increment by 10 pts and 10% in the score and progress bar, respectively.
*/

function adjustProgress () {
	let myProgress = whichQuestion; // add 1 if you want the bar to show 10% on question 1, and 100% on question 10.
	let myMeter = (myProgress/10); //to populate the progress bar, we use the attribs on the html5 element, no need to push contents inside the tags.
	$('.js-progress-bar').attr({
		"value": `${myMeter}`,
		"data-label": `${myMeter*100}% Complete`, // If the viewport is big enough, this label is used
		"data-small_label": `${myMeter*100}%  Complete` // smaller viewports use this label, w/ diff styling.
		});
}

function incrementScore(){
	//console.log("SCORE");
	numberCorrect += 10; // increment the score by 10.
	$('.js-score-board').html(`Score: ${numberCorrect}`); //update the score on the page.

}

/*
Display a message based on score.
score in the context of the function should always be a number.

*/

function displayResults(score) {

	if (score < 60){
		$('.js-results-tex').html("Better luck next time.</p><p>Why don't you play again?");
		$('.js-results-score').html(`You're final score is ${numberCorrect} / 100!`)
	} else if (score < 80){
		//do other stuff
		//console.log("less than 80");
	} else {
		//do this stuff
		//console.log('greater than 80');
	}
	$('.js-results-score').text(`You're final score is ${numberCorrect} / 100!`);
	return;

}


/*
resetGame clears all classes, attributes, and values used to track game progress.
Once everything is reset it calls on handleQuizApp and the party begines anew.
*/

function resetGame(){
	whichQuestion = 0;  //start at the beginning; reset score

	// remove classes and attrs used to denote last question
	//$('.js-correct-answer-modal').removeClass('js-modal-lastQuestion');
	//$('.js-incorrect-answer-modal').removeClass('js-modal-lastQuestion');
	$('#js-quiz-answers').find('button').removeAttr("lastQuestion");
	$('.js-results-unhidden').removeClass('js-results-unhidden').addClass('js-results-hidden');
	$('.js-start-hidden').removeClass('js-start-hidden').addClass('js-start-unhidden');
	$('.js-incorrect-answer-modal').removeClass('js-modal-lastQuestion').addClass('js-modal-notTheLastQuestion');
	$('.js-correct-answer-modal').removeClass('js-modal-lastQuestion').addClass('js-modal-notTheLastQuestion')

	//reset answer keys
	correctAnswerKey =0;
	incorrectAnswerKey.length = 0;
	numberCorrect = 0;
	$('.js-score-board').html(`Score: ${numberCorrect}`);

	// reinitialize the handleQuizApp
	handleQuizApp();

}





/*
On page load, initialize all of the functions and spin up the app.
questionLoader takes `store` as an object and we're specifically
interested in the `results` array at key 0. To view this data, check
out store.js. store.js is included in the bottom fo the index.html file.
*/
function handleQuizApp(){
	//gameOver();
	startGame();
	resetAnswers();
	randomizeAnswers();
	adjustProgress();
}

// When page loads, call `handleQuizApp`
$(handleQuizApp);
