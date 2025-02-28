const radioInputEl = document.querySelectorAll('input[type=radio]');
const textInputEl = document.querySelectorAll('input[type=text]');
const clearAllEl = document.querySelector('a');
const mortgageAmount = document.getElementById('mortgage-amount');
const term = document.getElementById('mortgage-term');
const interest = document.getElementById('interest-rate');
const calculateBtnEl = document.querySelector('button');
const repaymentEl = document.getElementById('repayment');
const interestOnlyEl = document.getElementById('interest-only');
const resultSectionEl = document.querySelector('.result-section');
const defaultCardEl = document.querySelector('.default-card');
const radioControlEl = document.querySelector('.radio-control');

let textInputOn = false;
let radioInputOn = false;

function clearData(){
          location.reload();
}
clearAllEl.addEventListener('click', clearData);  


function renderResultsCardToHTML(monthly_Repayment, total_Repayment){
          defaultCardEl.style.display = "none";
          resultSectionEl.innerHTML = '';
          let resultCard = document.createElement('div');
              resultCard.classList.add('result-card');
              resultCard.innerHTML = 
              `   
                <h1>Your results</h1>
                <p>Your results are shown below based on the information you provided. 
                  To adjust the results, edit the form and click “calculate repayments” again.
                </p>
                <div class="calculation-card">
                  <p>Your monthly repayments</p>
                  <span class="monthly-repayments">£${numberWithCommas(monthly_Repayment)}</span>
                  <div class="line"></div>
                  <p> Total you'll repay over the term</p>
                  <span class="total-repayments">£${numberWithCommas(total_Repayment)}</span>
                </div>
              `
              resultSectionEl.appendChild(resultCard);
}

function restoreDefaultCardToHTML(){
          resultSectionEl.childNodes[0].remove();
          defaultCardEl.style.display = "flex";
          resultSectionEl.appendChild(defaultCardEl);
}

function calculateRepayment(principal, interest, term, option){
          principal = principal.replace(/,/g, ''); // remove commas separator
          let p = Number(principal);
          let r = Number(interest);
          let n = Number(term);
          const mr = 12;
          if(option === 1){
              let monthlyRepaymentUnfixed = (p*(r/100)/mr) * ((1+(r/100)/mr)**(mr*n)) / 
                                        (((1+(r/100)/mr)**(mr*n)) -1);
              let monthlyRepayment = Number(monthlyRepaymentUnfixed.toFixed(2));
              let totalRepayment = (monthlyRepaymentUnfixed * (n*mr)).toFixed(2);
              renderResultsCardToHTML(monthlyRepayment, totalRepayment);
          }
          if(option === 2){
              let interestOnlyMonthly = (p * (r/100)/mr).toFixed(2);
              let interestOnlyTotal = (p * (r/100) * n).toFixed(2);
              renderResultsCardToHTML(interestOnlyMonthly, interestOnlyTotal);
          }
}


function doCalculation(){
          if(textInputOn && radioInputOn){
              radioInputEl.forEach((el)=>{
                if(el.checked && el === repaymentEl){
                    calculateRepayment(mortgageAmount.value, interest.value, term.value, 1);
                }
                if(el.checked && el === interestOnlyEl){
                  calculateRepayment(mortgageAmount.value, interest.value, term.value, 2);
                }
              })
          }
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

mortgageAmount.onkeyup = function(){
    this.nextElementSibling.children[0].style = "filter:brightness(0) saturate(100%) invert(43%) sepia(5%) saturate(2332%) hue-rotate(156deg) brightness(94%) contrast(95%)";
    let inputValue = this.value.replace(/,/g, ''); // remove commas separator
    return this.value = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function checkTextInput(){
          let textInputEmpty = ([...textInputEl].some(textInput => textInput.value ===''));
          if(textInputEmpty){
            textInputEl.forEach((el, index)=>{
              if(el.value === ''){
                  el.parentElement.parentElement.classList.add('red-alert');  
                if(index === 0){
                  el.nextElementSibling.children[0].style = "filter: brightness(0) saturate(100%) invert(98%) sepia(96%) saturate(7497%) hue-rotate(177deg) brightness(108%) contrast(104%)";
                }
              }
            })
            textInputOn = false;
            restoreDefaultCardToHTML();
          }
          else{
               textInputOn = true;
          }
}


textInputEl.forEach((el, index)=>{
        el.addEventListener('click', ()=>{
          if(index === 0){
            el.nextElementSibling.children[0].style.color = "var(--slate-700)";
          }
          el.parentElement.parentElement.classList.remove('red-alert');
        } )
})

function checkRadioInput(){
          let isNOTchecked = (![...radioInputEl].some(radio => radio.checked));
          if(isNOTchecked){
            radioControlEl.classList.add('red-alert');
            radioInputOn = false;
            restoreDefaultCardToHTML();
          }
          else{
              radioInputOn = true;
          }
}

function radioCheck(){
          radioInputEl.forEach((el)=>{
            if(el.checked){
              el.parentElement.style.border = "2px solid var(--lime)";
              el.parentElement.parentElement.style.border = "1px solid var(--lime)";
              el.parentElement.parentElement.style.backgroundColor = "var(--lime-light)";
            }
            else{
              el.parentElement.style.border = "2px solid var(--slate-700)";
              el.parentElement.parentElement.style.border = "1px solid var(--slate-500)";
              el.parentElement.parentElement.style.backgroundColor = "transparent";
            }
          })
}

radioInputEl.forEach((el)=>{
        el.addEventListener('click', ()=>{
           radioCheck();
           radioControlEl.classList.remove('red-alert');
        } )
})

calculateBtnEl.addEventListener('click', ()=>{
         checkTextInput();
         checkRadioInput(); 
         doCalculation(); 
});






