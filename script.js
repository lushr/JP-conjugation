let allCards=[],sets=[],currentSet=0,currentIndex=0;
const promptEl=document.getElementById("englishPrompt"),answerEl=document.getElementById("japaneseAnswer"),answerCard=document.getElementById("answerCard"),revealButton=document.getElementById("revealButton"),nextButton=document.getElementById("nextButton"),progressText=document.getElementById("progressText"),progressBar=document.getElementById("progressBar"),modeLabel=document.getElementById("modeLabel"),setLabel=document.getElementById("setLabel"),previousSet=document.getElementById("previousSet"),nextSet=document.getElementById("nextSet"),helpButton=document.getElementById("helpButton"),helpPanel=document.getElementById("helpPanel"),closeHelp=document.getElementById("closeHelp");
const SIZE=30;
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function word(c){return c.english.split(" — ")[0]}
function makeSets(cards){
 const kuru=cards.find(c=>word(c)==="くる");
 if(!kuru)throw Error("Missing くる");
 const others=cards.filter(c=>c!==kuru);
 const count=Math.ceil(others.length/(SIZE-1));
 const groups=Array.from({length:count},()=>[]);
 // Spread verbs and both adjective types throughout every set.
 for(const type of ["verb","i-adj","na-adj"]){
   const candidates=shuffle(others.filter(c=>c.type===type));
   candidates.forEach((card,i)=>groups[i%count].push(card));
 }
 const tricky=["いい","かっこいい","たかい","つまらない","なる","つく","おくる"];
 const extras=shuffle(others.filter(c=>tricky.includes(word(c))));
 return groups.map((group,i)=>{
   const deck=[...group];
   let offset=i;
   while(deck.length<SIZE-1){
     const options=extras.filter(c=>!deck.includes(c));
     if(!options.length)break;
     deck.push(options[offset%options.length]);offset++;
   }
   return shuffle([kuru,...deck]);
 });
}
function showCard(){
 const deck=sets[currentSet];if(!deck)return;
 const finished=currentIndex>=deck.length;
 modeLabel.textContent=`Set ${currentSet+1} of ${sets.length}`;
 setLabel.textContent=`Set ${currentSet+1}`;
 previousSet.disabled=currentSet===0;nextSet.disabled=currentSet===sets.length-1;
 progressText.textContent=`${Math.min(currentIndex+1,deck.length)}/${deck.length}`;
 progressBar.style.width=`${(Math.min(currentIndex+1,deck.length)/deck.length)*100}%`;
 answerCard.classList.add("hidden");
 if(finished){
   promptEl.textContent="Set complete!";
   answerEl.textContent="";
   revealButton.classList.add("hidden");
   if(currentSet<sets.length-1){answerCard.classList.remove("hidden");nextButton.textContent="Next set →"}
   return;
 }
 const c=deck[currentIndex];promptEl.textContent=c.english;answerEl.textContent=c.japanese;
 revealButton.classList.remove("hidden");nextButton.textContent=currentIndex===deck.length-1?"Finish set":"Next";
}
function chooseSet(n){if(n<0||n>=sets.length)return;currentSet=n;currentIndex=0;showCard();window.scrollTo({top:0,behavior:"smooth"})}
revealButton.addEventListener("click",()=>{answerCard.classList.remove("hidden");revealButton.classList.add("hidden")});
nextButton.addEventListener("click",()=>{if(currentIndex>=sets[currentSet].length){chooseSet(currentSet+1);return}currentIndex++;showCard();window.scrollTo({top:0,behavior:"smooth"})});
previousSet.addEventListener("click",()=>chooseSet(currentSet-1));nextSet.addEventListener("click",()=>chooseSet(currentSet+1));
helpButton.addEventListener("click",()=>helpPanel.classList.remove("hidden"));closeHelp.addEventListener("click",()=>helpPanel.classList.add("hidden"));helpPanel.addEventListener("click",e=>{if(e.target===helpPanel)helpPanel.classList.add("hidden")});
async function loadDeck(){try{const r=await fetch("conjugations.json");if(!r.ok)throw Error();allCards=await r.json();sets=makeSets(allCards);showCard()}catch(e){promptEl.textContent="Error loading conjugation deck";progressText.textContent="0/0"}}
if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}))}loadDeck();
