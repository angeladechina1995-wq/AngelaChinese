
(() => {
  const DATA = window.NPCR1_PRACTICE_DATA;
  if (!DATA) return;

  const STORAGE_KEY = 'npcr1PracticeV1';
  const PRODUCTS_KEY = 'npcr1PracticeProductsV1';
  const defaultState = () => ({
    lessonProgress: {}, errors: [], products: {},
    stats: {vocab:0, order:0, listen:0, dialogue:0, task:0, randomCompleted:0},
    lastUpdated: null
  });
  let state;
  let storageWorking = true;
  try {
    state = Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    state = defaultState();
    storageWorking = false;
  }
  state.lessonProgress ||= {};
  state.errors ||= [];
  state.products ||= {};
  state.stats = Object.assign(defaultState().stats, state.stats || {});

  function readProductBackup(){
    const merged={};
    try{
      Object.assign(merged,JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'{}'));
    }catch(error){}
    try{
      Object.assign(merged,JSON.parse(sessionStorage.getItem(PRODUCTS_KEY)||'{}'));
    }catch(error){}
    return merged;
  }
  state.products=Object.assign({},readProductBackup(),state.products);

  let session = null;
  const el = id => document.getElementById(id);
  const views = ['practiceHome','lessonPicker','exerciseView','resultView','achievementView'];
  const langNow = () => (typeof language !== 'undefined' && language === 'es') ? 'es' : 'zh';
  const t = value => value && typeof value === 'object' && ('zh' in value) ? value[langNow()] : value;
  const bi = (zh, es) => ({zh, es});
  const labels = {
    zh:{lesson:n=>`第${n}课`, start:'开始闯关', continue:'重新挑战', completed:'已完成', score:'首次作答得分', hint:'查看提示', next:'下一项', check:'检查答案', reset:'重新排列', play:'播放句子', question:'练习', of:'/', points:'分', noErrors:'目前没有错题。继续闯关后，答错的客观题会自动出现在这里。', randomTitle:'随机挑战', errorsTitle:'错题复习', results:'挑战结果', home:'返回练习首页', retry:'再挑战一次', achievements:'我的成果', copy:'复制成果', copied:'已复制', emptyOrder:'点击下方词语组成句子', dialogue:'分支对话', task:'最终情景任务', finishTask:'生成成果卡', finish:'完成挑战', wrong:'还不对，再试一次。', correct:'回答正确。', hintUsed:'使用提示后，本题不计入首次作答得分。', randomDone:'随机挑战完成', errorDone:'错题复习完成', cleared:'已清除错题', listenTip:'先听，不要急着看提示。', allLessons:'十课学习路线', objective:'客观题', progress:'完成进度', firstTry:'首次正确', hints:'使用提示', stars:'星级', taskNeeded:'请先填写全部信息。', productSaved:'成果卡已保存到当前浏览器。', productSaveFailed:'成果卡已经生成，但浏览器未允许保存。请使用导出功能备份。', exportDone:'学习记录已导出。', importDone:'学习记录已导入。', importFailed:'无法导入：文件格式不正确。', storageOk:'当前浏览器可以正常保存学习记录。', storageBad:'当前浏览器没有允许本地保存。请使用导出功能备份。', viewSavedCard:'立即查看我的情景卡', productAdded:'已加入“我的情景卡”', cards:n=>`${n}张`, noLessonName:'情景任务'},
    es:{lesson:n=>`Lección ${n}`, start:'Comenzar', continue:'Repetir', completed:'Completada', score:'Puntuación al primer intento', hint:'Ver pista', next:'Siguiente', check:'Comprobar', reset:'Reordenar', play:'Escuchar frase', question:'Ejercicio', of:'/', points:'puntos', noErrors:'No hay errores guardados. Las preguntas objetivas falladas aparecerán aquí automáticamente.', randomTitle:'Reto aleatorio', errorsTitle:'Repaso de errores', results:'Resultado', home:'Volver al inicio', retry:'Repetir reto', achievements:'Mis logros', copy:'Copiar resultado', copied:'Copiado', emptyOrder:'Pulsa las palabras para formar la frase', dialogue:'Diálogo ramificado', task:'Tarea final', finishTask:'Generar tarjeta', finish:'Finalizar', wrong:'Todavía no. Inténtalo de nuevo.', correct:'Respuesta correcta.', hintUsed:'Al usar una pista, esta pregunta deja de contar como acierto al primer intento.', randomDone:'Reto aleatorio completado', errorDone:'Repaso de errores completado', cleared:'Errores eliminados', listenTip:'Escucha primero y deja la pista para después.', allLessons:'Ruta de diez lecciones', objective:'Preguntas objetivas', progress:'Progreso', firstTry:'Primer intento', hints:'Pistas usadas', stars:'Estrellas', taskNeeded:'Completa todos los campos.', productSaved:'La tarjeta se ha guardado en este navegador.', productSaveFailed:'La tarjeta se ha generado, pero el navegador no ha permitido guardarla. Utiliza la exportación como copia de seguridad.', exportDone:'Registro exportado.', importDone:'Registro importado.', importFailed:'No se puede importar: el formato del archivo no es válido.', storageOk:'Este navegador puede guardar correctamente el registro.', storageBad:'Este navegador no permite el almacenamiento local. Utiliza la exportación como copia de seguridad.', viewSavedCard:'Ver mi tarjeta ahora', productAdded:'Añadida a «Mis tarjetas»', cards:n=>`${n} tarjetas`, noLessonName:'Tarea situacional'}
  };
  const L = () => labels[langNow()];

  function saveProductBackup(){
    let saved=false;
    const payload=JSON.stringify(state.products||{});
    try{
      localStorage.setItem(PRODUCTS_KEY,payload);
      saved=true;
    }catch(error){}
    try{
      sessionStorage.setItem(PRODUCTS_KEY,payload);
      saved=true;
    }catch(error){}
    return saved;
  }

  function save(){
    state.lastUpdated = new Date().toISOString();
    const productSaved=saveProductBackup();
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageWorking = true;
      return true;
    }catch(error){
      storageWorking = productSaved;
      console.warn('Unable to save full practice progress:', error);
      return productSaved;
    }
  }
  function showView(id){ views.forEach(v => el(v).classList.toggle('practice-hidden', v !== id)); window.scrollTo({top:0,behavior:'smooth'}); }
  function lessonById(id){ return DATA.lessons.find(l => l.id === Number(id)); }
  function allObjective(){ return DATA.lessons.flatMap(l => [...l.vocab,...l.order,...l.listen]); }
  function questionById(id){ return allObjective().find(q => q.id === id); }
  function starsFor(score,max,hints=0){ const pct=score/max; if(pct>=.85 && hints<=2)return 3; if(pct>=.62)return 2; if(pct>=.38)return 1; return 0; }
  function starsHtml(n){ return `<span class="stars">${[1,2,3].map(i=>`<span class="${i<=n?'':'off'}">★</span>`).join('')}</span>`; }
  function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function updateSummary(){
    const completed = DATA.lessons.filter(l => state.lessonProgress[l.id]?.completed).length;
    const totalStars = DATA.lessons.reduce((sum,l)=>sum+(state.lessonProgress[l.id]?.stars||0),0);
    el('completedCount').textContent = `${completed}/10`;
    el('starCount').textContent = `${totalStars}/30`;
    el('errorCount').textContent = state.errors.length;
    el('productCount').textContent = Object.keys(state.products).length;
  }

  function renderRoute(){
    const targets=[el('lessonRoute'),el('lessonRoutePicker')].filter(Boolean);
    targets.forEach(route=>route.innerHTML='');
    DATA.lessons.forEach(lesson=>{
      const p=state.lessonProgress[lesson.id];
      targets.forEach(route=>{
        const button=document.createElement('button'); button.type='button'; button.className='route-card'+(p?.completed?' completed':'');
        button.innerHTML=`<span class="route-number">${lesson.id}</span><h3>${escapeHtml(t(lesson.mission))}</h3><span class="route-title">${escapeHtml(t(lesson.title))}</span><span class="route-mission">${escapeHtml(t(lesson.description))}</span><span class="route-progress"><span>${p?.completed?L().completed:L().start}</span>${starsHtml(p?.stars||0)}</span>`;
        button.onclick=()=>startLesson(lesson.id); route.appendChild(button);
      });
    });
    const stages=el('stageStrip'); stages.innerHTML='';
    DATA.stages.forEach(stage=>{
      const unlocked=stage.lessons.every(id=>state.lessonProgress[id]?.completed);
      const div=document.createElement('div'); div.className='stage-badge'+(unlocked?' unlocked':'');
      div.innerHTML=`<strong>${unlocked?'✓':'○'} ${escapeHtml(t(stage.title))}</strong><span>${stage.lessons.map(n=>L().lesson(n)).join(' · ')}</span>`;
      stages.appendChild(div);
    });
  }

  function renderHome(){ updateSummary(); renderRoute(); showView('practiceHome'); }

  function makeLessonQueue(lesson){ return [...lesson.vocab,...lesson.order,...lesson.listen,lesson.dialogue,lesson.task]; }
  function startLesson(id){
    const lesson=lessonById(id);
    session={mode:'lesson',lessonId:id,title:t(lesson.mission),queue:makeLessonQueue(lesson),index:0,score:0,max:13,hints:0,categoryHits:{vocab:0,order:0,listen:0,dialogue:0,task:0},itemState:{},dialogueState:null,product:null};
    showView('exerciseView'); renderExercise();
  }
  function startRandom(){
    const pool=[...allObjective()];
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    session={mode:'random',title:L().randomTitle,queue:pool.slice(0,10),index:0,score:0,max:10,hints:0,categoryHits:{vocab:0,order:0,listen:0},itemState:{}};
    showView('exerciseView'); renderExercise();
  }
  function startErrors(){
    const queue=state.errors.map(questionById).filter(Boolean);
    if(!queue.length){
      el('lessonPickerKicker').textContent=L().errorsTitle;
      el('lessonPickerTitle').textContent=L().errorsTitle;
      el('lessonRoutePicker').classList.add('practice-hidden');
      el('emptyMessage').textContent=L().noErrors;
      el('emptyMessage').classList.remove('practice-hidden');
      showView('lessonPicker'); return;
    }
    session={mode:'errors',title:L().errorsTitle,queue,index:0,score:0,max:queue.length,hints:0,categoryHits:{vocab:0,order:0,listen:0},itemState:{},cleared:0};
    showView('exerciseView'); renderExercise();
  }

  function currentItem(){return session.queue[session.index];}
  function itemState(){ const q=currentItem(); return session.itemState[q.id] ||= {eligible:true,hint:false,wrong:false,done:false}; }
  function markHint(){ const st=itemState(); if(st.hint)return; st.hint=true; st.eligible=false; session.hints++; renderFeedback('hint',`${escapeHtml(t(currentItem().hint))}<br><small>${escapeHtml(L().hintUsed)}</small>`); updateExerciseHeader(); }
  function markWrong(q){ const st=itemState(); st.wrong=true; st.eligible=false; if(q.id && !state.errors.includes(q.id) && ['vocab','order','listen'].includes(q.category)){ state.errors.push(q.id); save(); } }
  function markCorrect(q){ const st=itemState(); if(st.done)return; st.done=true; if(st.eligible){session.score++; session.categoryHits[q.category]=(session.categoryHits[q.category]||0)+1; state.stats[q.category]=(state.stats[q.category]||0)+1;} if(session.mode==='errors' && state.errors.includes(q.id)){ state.errors=state.errors.filter(id=>id!==q.id); session.cleared++; save(); } }
  function renderFeedback(kind,html){ const box=el('feedbackBox'); box.className=`feedback-box ${kind}`; box.innerHTML=html; box.classList.remove('practice-hidden'); }
  function clearFeedback(){ const box=el('feedbackBox'); box.className='feedback-box practice-hidden'; box.innerHTML=''; }
  function nextItem(){ session.index++; if(session.index>=session.queue.length){finishSession();return;} renderExercise(); }

  function updateExerciseHeader(){
    const pct=(session.index/session.queue.length)*100;
    el('exerciseProgressFill').style.width=`${pct}%`;
    el('exerciseCounter').textContent=`${session.index+1} ${L().of} ${session.queue.length}`;
    el('exerciseScore').textContent=`${L().score}: ${session.score}/${session.max}`;
    el('exerciseTitle').textContent=session.title;
  }

  function speak(text){ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.78;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>/^zh-CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang))||null;speechSynthesis.speak(u); }

  function renderExercise(){
    clearFeedback(); updateExerciseHeader();
    const q=currentItem(), card=el('exerciseCard'); card.innerHTML='';
    if(q.type==='choice') renderChoice(q,card);
    else if(q.type==='listen') renderListen(q,card);
    else if(q.type==='order') renderOrder(q,card);
    else if(q.type==='dialogue') renderDialogue(q,card);
    else if(q.type==='task') renderTask(q,card);
  }

  function categoryName(q){
    const names={zh:{vocab:'词汇速配',order:'语序解谜',listen:'听力挑战',dialogue:'分支对话',task:'最终情景任务'},es:{vocab:'Vocabulario',order:'Orden de palabras',listen:'Comprensión auditiva',dialogue:'Diálogo ramificado',task:'Tarea final'}};
    return names[langNow()][q.category];
  }
  function baseCard(q,card){
    card.innerHTML=`<div class="exercise-kicker">${escapeHtml(categoryName(q))}</div><h2>${escapeHtml(t(q.prompt||q.title))}</h2>${q.prompt&&q.title?`<p class="question-subtitle">${escapeHtml(t(q.title))}</p>`:''}`;
  }
  function addCommonActions(card,q){
    const actions=document.createElement('div');actions.className='exercise-actions';
    const hint=document.createElement('button');hint.type='button';hint.className='practice-button ghost';hint.textContent=L().hint;hint.onclick=markHint;
    const next=document.createElement('button');next.type='button';next.className='practice-button primary practice-hidden';next.textContent=L().next;next.id='nextQuestion';next.onclick=nextItem;
    actions.append(hint,next);card.appendChild(actions);
  }
  function showNext(){ const n=el('nextQuestion'); if(n)n.classList.remove('practice-hidden'); }

  function renderChoice(q,card){
    baseCard(q,card);const grid=document.createElement('div');grid.className='choice-grid';
    q.options.forEach((opt,i)=>{const b=document.createElement('button');b.type='button';b.className='choice-option';b.textContent=opt;b.onclick=()=>{
      if(itemState().done)return;
      if(i===q.answer){b.classList.add('correct');markCorrect(q);renderFeedback('good',`<strong>${escapeHtml(L().correct)}</strong><br>${escapeHtml(t(q.explanation))}`);[...grid.children].forEach(x=>x.disabled=true);showNext();}
      else{b.classList.add('wrong');setTimeout(()=>b.classList.remove('wrong'),450);markWrong(q);renderFeedback('bad',escapeHtml(L().wrong));}
    };grid.appendChild(b);});card.appendChild(grid);addCommonActions(card,q);
  }
  function renderListen(q,card){
    baseCard(q,card);const sound=document.createElement('div');sound.className='sound-row';
    const play=document.createElement('button');play.type='button';play.className='practice-button primary';play.textContent=`▶ ${L().play}`;play.onclick=()=>speak(q.speech);sound.appendChild(play);
    const tip=document.createElement('span');tip.className='question-subtitle';tip.textContent=L().listenTip;sound.appendChild(tip);card.appendChild(sound);
    const grid=document.createElement('div');grid.className='choice-grid';
    q.options.forEach((opt,i)=>{const b=document.createElement('button');b.type='button';b.className='choice-option';b.textContent=opt;b.onclick=()=>{
      if(itemState().done)return;
      if(i===q.answer){b.classList.add('correct');markCorrect(q);renderFeedback('good',`<strong>${escapeHtml(L().correct)}</strong><br>${escapeHtml(t(q.explanation))}`);[...grid.children].forEach(x=>x.disabled=true);showNext();}
      else{b.classList.add('wrong');setTimeout(()=>b.classList.remove('wrong'),450);markWrong(q);renderFeedback('bad',escapeHtml(L().wrong));}
    };grid.appendChild(b);});card.appendChild(grid);addCommonActions(card,q);
  }
  function renderOrder(q,card){
    baseCard(q,card);let selected=[];const zone=document.createElement('div');zone.className='order-zone empty';zone.dataset.empty=L().emptyOrder;const bank=document.createElement('div');bank.className='token-bank';
    const shuffled=q.tokens.map((v,i)=>({v,i})).sort(()=>Math.random()-.5);
    function redraw(){zone.innerHTML='';zone.classList.toggle('empty',!selected.length);selected.forEach(obj=>{const b=document.createElement('button');b.type='button';b.className='token';b.textContent=obj.v;b.onclick=()=>{selected=selected.filter(x=>x!==obj);redraw();};zone.appendChild(b);});[...bank.children].forEach((b,idx)=>b.classList.toggle('selected',selected.includes(shuffled[idx])));}
    shuffled.forEach(obj=>{const b=document.createElement('button');b.type='button';b.className='token';b.textContent=obj.v;b.onclick=()=>{if(!selected.includes(obj)){selected.push(obj);redraw();}};bank.appendChild(b);});
    card.append(zone,bank);const controls=document.createElement('div');controls.className='exercise-actions';
    const hint=document.createElement('button');hint.className='practice-button ghost';hint.textContent=L().hint;hint.onclick=markHint;
    const reset=document.createElement('button');reset.className='practice-button';reset.textContent=L().reset;reset.onclick=()=>{selected=[];redraw();};
    const check=document.createElement('button');check.className='practice-button primary';check.textContent=L().check;check.onclick=()=>{if(itemState().done)return;const ok=selected.length===q.answer.length&&selected.every((x,i)=>x.v===q.answer[i]);if(ok){markCorrect(q);renderFeedback('good',`<strong>${escapeHtml(L().correct)}</strong><br>${escapeHtml(t(q.explanation))}`);check.disabled=true;hint.disabled=true;reset.disabled=true;next.classList.remove('practice-hidden');}else{markWrong(q);renderFeedback('bad',escapeHtml(L().wrong));}};
    const next=document.createElement('button');next.className='practice-button primary practice-hidden';next.textContent=L().next;next.onclick=nextItem;next.id='nextQuestion';controls.append(hint,reset,check,next);card.appendChild(controls);redraw();
  }

  function renderDialogue(q,card){
    baseCard(q,card);session.dialogueState ||= {step:0,history:[],eligible:true};const ds=session.dialogueState;
    const win=document.createElement('div');win.className='dialogue-window';const hist=document.createElement('div');hist.className='dialogue-history';
    ds.history.forEach(h=>{const b=document.createElement('div');b.className='bubble '+h.who;b.textContent=h.text;hist.appendChild(b);});
    const step=q.steps[ds.step];if(step){const a=document.createElement('div');a.className='bubble';a.textContent=step.line;hist.appendChild(a);}win.appendChild(hist);
    if(step){const choices=document.createElement('div');choices.className='choice-grid';step.options.forEach((opt,i)=>{const b=document.createElement('button');b.type='button';b.className='choice-option';b.textContent=opt;b.onclick=()=>{
      if(i===step.answer){clearFeedback();ds.history.push({who:'other',text:step.line},{who:'user',text:opt});ds.step++;if(ds.step>=q.steps.length){if(ds.eligible){session.score++;session.categoryHits.dialogue++;state.stats.dialogue++;}itemState().done=true;renderDialogue(q,card);renderFeedback('good',escapeHtml(langNow()==='zh'?'对话完成，交流很自然。':'Diálogo completado de forma natural.'));}else renderDialogue(q,card);}else{ds.eligible=false;markWrong({id:null,category:'dialogue'});renderFeedback('bad',escapeHtml(t(step.feedback)));}
    };choices.appendChild(b);});win.appendChild(choices);}else{const end=document.createElement('div');end.className='product-card';end.textContent=langNow()==='zh'?'对话任务完成。':'Diálogo completado.';win.appendChild(end);const next=document.createElement('button');next.className='practice-button primary';next.textContent=L().next;next.onclick=()=>{session.dialogueState=null;nextItem();};win.appendChild(next);}card.appendChild(win);
  }

  function renderTask(q,card){
    baseCard(q,card);const p=document.createElement('p');p.className='question-subtitle';p.textContent=t(q.prompt);card.appendChild(p);const form=document.createElement('div');form.className='task-form';
    q.fields.forEach(f=>{const wrap=document.createElement('div');wrap.className='task-field';const label=document.createElement('label');label.textContent=t(f.label);let input;if(f.kind==='select'){input=document.createElement('select');const blank=document.createElement('option');blank.value='';blank.textContent='—';input.appendChild(blank);f.options.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;input.appendChild(op);});}else{input=document.createElement('input');input.type='text';input.placeholder=t(f.placeholder)||'';}input.name=f.name;wrap.append(label,input);form.appendChild(wrap);});card.appendChild(form);
    const actions=document.createElement('div');
    actions.className='exercise-actions';
    const generate=document.createElement('button');
    generate.className='practice-button primary';
    generate.textContent=L().finishTask;
    const viewSaved=document.createElement('button');
    viewSaved.className='practice-button scenario-view-button practice-hidden';
    viewSaved.textContent=L().viewSavedCard;
    const finish=document.createElement('button');
    finish.className='practice-button primary practice-hidden';
    finish.textContent=L().finish;
    actions.append(generate,viewSaved,finish);
    card.appendChild(actions);
    generate.onclick=()=>{const values={};let valid=true;form.querySelectorAll('input,select').forEach(i=>{values[i.name]=i.value.trim();if(!values[i.name])valid=false;});if(!valid){renderFeedback('bad',escapeHtml(L().taskNeeded));return;}let output=q.template;Object.entries(values).forEach(([k,v])=>output=output.replaceAll(`{${k}}`,v));let product=card.querySelector('.product-card');if(!product){product=document.createElement('div');product.className='product-card';card.insertBefore(product,actions);}product.textContent=output;session.product=output;
      if(session.lessonId){
        state.products[session.lessonId]={text:output,date:new Date().toISOString()};
      }
      if(!itemState().done){
        session.score++;
        session.categoryHits.task++;
        state.stats.task++;
        itemState().done=true;
      }
      const saved=save();
      const message=saved
        ? `${L().productAdded}。${L().productSaved}`
        : L().productSaveFailed;
      renderFeedback(saved?'good':'bad',escapeHtml(message));
      viewSaved.classList.remove('practice-hidden');
      finish.classList.remove('practice-hidden');
      generate.textContent=langNow()==='zh'?'更新成果卡':'Actualizar tarjeta';
    };
    viewSaved.onclick=()=>{
      const lessonId=session.lessonId;
      renderAchievements();
      window.setTimeout(()=>{
        const savedCard=document.querySelector(`.saved-product[data-lesson="${lessonId}"]`);
        if(savedCard){
          savedCard.scrollIntoView({behavior:'smooth',block:'center'});
          savedCard.classList.add('scenario-card-highlight');
          window.setTimeout(()=>savedCard.classList.remove('scenario-card-highlight'),1600);
        }else{
          const status=el('storageStatus');
          if(status){
            status.textContent=L().productSaveFailed;
            status.className='storage-status bad';
          }
        }
      },80);
    };
    finish.onclick=nextItem;
  }

  function finishSession(){
    speechSynthesis.cancel();const stars=starsFor(session.score,session.max,session.hints);
    if(session.mode==='lesson'){
      state.lessonProgress[session.lessonId]={completed:true,score:session.score,max:session.max,hints:session.hints,stars,date:new Date().toISOString()};
      if(session.product)state.products[session.lessonId]={text:session.product,date:new Date().toISOString()};
    }else if(session.mode==='random'){state.stats.randomCompleted++;}
    save();renderResults(stars);
  }
  function renderResults(stars){
    showView('resultView');const title=session.mode==='lesson'?t(lessonById(session.lessonId).mission):(session.mode==='random'?L().randomDone:L().errorDone);el('resultTitle').textContent=title;el('resultStars').innerHTML=starsHtml(stars);el('resultScore').textContent=`${session.score}/${session.max}`;el('resultFirstTry').textContent=session.score;el('resultHints').textContent=session.hints;el('resultErrors').textContent=state.errors.length;el('resultClearedWrap').classList.toggle('practice-hidden',session.mode!=='errors');el('resultCleared').textContent=session.cleared||0;el('retryButton').onclick=()=>{if(session.mode==='lesson')startLesson(session.lessonId);else if(session.mode==='random')startRandom();else startErrors();};
  }

  function renderAchievements(){
    if(session && session.lessonId && session.product){
      state.products[session.lessonId]={
        text:session.product,
        date:new Date().toISOString()
      };
    }
    state.products=Object.assign({},readProductBackup(),state.products||{});
    saveProductBackup();
    showView('achievementView');
    const storageStatus=el('storageStatus');
    if(storageStatus){
      storageStatus.textContent=storageWorking?L().storageOk:L().storageBad;
      storageStatus.className='storage-status '+(storageWorking?'ok':'bad');
    }
    const products=el('productList');
    products.innerHTML='';
    const entries=Object.entries(state.products||{})
      .filter(([,p])=>p && typeof p.text==='string' && p.text.trim())
      .sort((a,b)=>Number(a[0])-Number(b[0]));
    const countBadge=el('savedProductCount');
    if(countBadge) countBadge.textContent=L().cards(entries.length);
    el('productEmpty').classList.toggle('practice-hidden',entries.length>0);
    entries.forEach(([id,p])=>{
      const lesson=lessonById(id);
      const d=document.createElement('div');
      d.className='saved-product';
      d.dataset.lesson=id;
      const mission=lesson?t(lesson.mission):L().noLessonName;
      d.innerHTML=`<small>${escapeHtml(L().lesson(id))} · ${escapeHtml(mission)}</small><p>${escapeHtml(p.text)}</p>`;
      const b=document.createElement('button');
      b.className='practice-button';
      b.textContent=L().copy;
      b.onclick=async()=>{
        try{
          await navigator.clipboard.writeText(p.text);
          b.textContent=L().copied;
        }catch{}
      };
      d.appendChild(b);
      products.appendChild(d);
    });

    const grid=el('achievementGrid');
    grid.innerHTML='';
    const completed=DATA.lessons
      .filter(l=>state.lessonProgress[l.id]?.completed)
      .map(l=>l.id);
    const badges=[
      {name:bi('词汇侦探','Detective de vocabulario'),desc:bi('20道词汇题首次答对','20 preguntas de vocabulario correctas al primer intento'),ok:state.stats.vocab>=20},
      {name:bi('语序高手','Especialista en orden'),desc:bi('10道语序题首次答对','10 ejercicios de orden correctos al primer intento'),ok:state.stats.order>=10},
      {name:bi('听力达人','Experto/a en comprensión'),desc:bi('10道听力题首次答对','10 ejercicios auditivos correctos al primer intento'),ok:state.stats.listen>=10},
      ...DATA.stages.map(s=>({
        name:s.title,
        desc:bi(
          `完成第${s.lessons[0]}—${s.lessons[1]}课`,
          `Completa las lecciones ${s.lessons[0]}–${s.lessons[1]}`
        ),
        ok:s.lessons.every(id=>completed.includes(id))
      })),
      {name:bi('全册旅行者','Viajero/a del libro'),desc:bi('完成第一册十课闯关','Completa las diez lecciones'),ok:completed.length===10},
      {name:bi('随机挑战者','Reto aleatorio'),desc:bi('完成3次随机挑战','Completa 3 retos aleatorios'),ok:state.stats.randomCompleted>=3},
    ];
    badges.forEach(b=>{
      const d=document.createElement('div');
      d.className='achievement-card '+(b.ok?'':'locked');
      d.innerHTML=`<strong>${b.ok?'✓':'○'} ${escapeHtml(t(b.name))}</strong><span>${escapeHtml(t(b.desc))}</span>`;
      grid.appendChild(d);
    });
  }


  function exportProgress(){
    const payload={
      format:'AulaChinoAngela-NPCR1-Practice',
      version:1,
      exportedAt:new Date().toISOString(),
      state
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const date=new Date().toISOString().slice(0,10);
    a.href=url;
    a.download=`npcr1-learning-record-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    const status=el('storageStatus');
    if(status){status.textContent=L().exportDone;status.className='storage-status ok';}
  }

  function validImportedState(value){
    return value && typeof value==='object'
      && value.lessonProgress && typeof value.lessonProgress==='object'
      && Array.isArray(value.errors)
      && value.products && typeof value.products==='object'
      && value.stats && typeof value.stats==='object';
  }

  function importProgressFile(file){
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(reader.result);
        const imported=parsed && parsed.state ? parsed.state : parsed;
        if(!validImportedState(imported)) throw new Error('Invalid progress format');
        state=Object.assign(defaultState(),imported);
        state.lessonProgress ||= {};
        state.errors ||= [];
        state.products ||= {};
        state.stats=Object.assign(defaultState().stats,state.stats||{});
        saveProductBackup();
        const saved=save();
        renderAchievements();
        updateSummary();
        const status=el('storageStatus');
        if(status){
          status.textContent=saved?L().importDone:L().productSaveFailed;
          status.className='storage-status '+(saved?'ok':'bad');
        }
      }catch(error){
        const status=el('storageStatus');
        if(status){status.textContent=L().importFailed;status.className='storage-status bad';}
      }finally{
        el('importProgressFile').value='';
      }
    };
    reader.readAsText(file,'utf-8');
  }

  el('exportProgress').onclick=exportProgress;
  el('importProgress').onclick=()=>el('importProgressFile').click();
  el('importProgressFile').addEventListener('change',event=>{
    const file=event.target.files && event.target.files[0];
    if(file) importProgressFile(file);
  });


  function returnToPreviousPage(){
    if(window.history.length > 1){
      window.history.back();
    }else{
      window.location.href='../courses/npcr-1.html';
    }
  }

  el('practiceBack')?.addEventListener('click',returnToPreviousPage);

  el('modeLessons').onclick=()=>{
    el('lessonPickerKicker').textContent=langNow()==='zh'?'按课闯关':'Misiones por lección';
    el('lessonPickerTitle').textContent=langNow()==='zh'?'选择一项生活任务':'Elige una misión cotidiana';
    el('lessonRoutePicker').classList.remove('practice-hidden');
    el('emptyMessage').classList.add('practice-hidden');
    renderRoute();showView('lessonPicker');
  };
  el('modeRandom').onclick=startRandom;
  el('modeErrors').onclick=startErrors;
  el('modeAchievements').onclick=renderAchievements;
  document.querySelectorAll('[data-practice-home]').forEach(b=>b.onclick=renderHome);
  el('backToLessons').onclick=()=>{if(session?.mode==='lesson'){renderRoute();showView('lessonPicker');}else renderHome();};
  el('retryButton').onclick=()=>{};
  el('resultHome').onclick=renderHome;
  el('achievementHome').onclick=renderHome;
  el('lessonPickerHome').onclick=renderHome;
  el('lang')?.addEventListener('click',()=>setTimeout(()=>{
    if(!el('exerciseView').classList.contains('practice-hidden')) renderExercise();
    else if(!el('resultView').classList.contains('practice-hidden')) renderResults(starsFor(session.score,session.max,session.hints));
    else if(!el('achievementView').classList.contains('practice-hidden')) renderAchievements();
    else if(!el('lessonPicker').classList.contains('practice-hidden')) { renderRoute(); }
    else renderHome();
  },0));
  const routeParams=new URLSearchParams(window.location.search);
  const directLesson=Number(routeParams.get('lesson'));
  const directMode=routeParams.get('mode');
  if(Number.isInteger(directLesson) && directLesson>=1 && directLesson<=10){
    startLesson(directLesson);
  }else if(directMode==='random'){
    startRandom();
  }else if(directMode==='errors'){
    startErrors();
  }else{
    renderHome();
  }
})();
