import { ass, asseq, nonNull } from "../2023/ts/common";

const test = `2333133121414131402`;
const real =
  "7839105685433013714577744422503527278971505960753846696142926278672617237575485286677159338235399035306979223432754870913858965422187978297379842572204980878417875562906234774960549491579742393512183257495060648682356621595018634429939318405794271814717662329720599531302316755296303995988543326927224329169957141263633919324882224314721347533064639375165479309157262071153341435732918424503932471314108574909083829766577763175247705413567394652672118187596212279819758451558513692673402145123711898026129483689247563242821021733040132522687330439917367417553663609237257223538680281592707814918497496773152659383451932774174559672724949594213081236880261724636974425633552750629736879539994675221955887418931699753581581625321530364341189872394015688641897832167293342622982682415256336063291239121360461975569041888929119459292038345383958275392359737155865037791127437255669431852199437591536519699273484919877973377373771967696494864110153921118347477147594892719528235594971017557741814035182461917119314887771770385346504673475061132522694748631198291744938459292839603433946825465719524149911376146210113573315090363147272534972274871296285514191583127929482063874169388078574876895771549855201897906833969957776092121911863914186316972578114526974158707146665749396479115738963891775338993687274533772264824993923096582698405591146644647099989851996621334922766854385459784936626149316425786198395990238669779234529248638835248331987590398573791520884710848039695396764650987113267191137583724588544878897590538183862178414279484843336981339686471186652678464985222344727450435988379998699270659914498884565960723116827050583828832572871119339424803779234819926661485554783290727277179457692161962425681797863440304028269410575321234268542426976635527775273218529215762364477999175231879657407369456955152215236084643314358547272335158866504915397085905911545330607760845375681929543868375513593970925881729931815076892210402484958022493257941294288081908529975539864430326866141564627356605780275899771737632749419111228534799039769054937027999727351847738997689874497144349063184093825922178377231720912945529120709130767456324587833267149448676693759915857877777112294160583057824875156419556957287229695632269554189769297870581486409117283829563563896935695024569376538518665899747665567158607359283648482242157270442133957826242013311168194339253845216157991636375428721194519315213275789263819278188142513466209775767192356132654838177757871942465477999563344873162156219599983553771583598980346457618790411022587457269398538845912333382369187259936354635819546611148921482036965655991999529350432686252767123366548372679824885658225621626072847134778373121577544366901366245723289627511644974997251296645285689567522794692686808754964123725815884969643248921434886429727945758228894389425858894015511699197767599067162138291792723422713021443650434337881214409445722377271642301711921285375919508542722998219454114513235770742697564244492741794018865960159554504591799678769698681857236429521815203183556423523959342330347024705434201018499723963112954281714675185877441715723989824960137175322893294164897060262382291798356062813912494639783142336950936511444648852550397092749658683864307097696872236264576584134758499046475516574830369038207920296538573246815619164888362920277876413781806164749258957565808297321177704962207874188219703898141592723943739855864738969097677044381425488828433057759248436898454161161266558743913331747737547193249154998019111925292369425190525179107930136023444217287461918427658049864567993160938795338827114018342697618083807579891728738176149644242170951584915633769635441034659172919081481936628794494855978077357359131787814746748169692291261794895284538669375158616296317945413678373847528866755569949561798114701025405728541288333514608627149157611916245818771612276683145871894033372986761461419871545898399666761382693770907823527271113728966261491813481887199880561116141755123544512497519254698759947289739318729464843574946537716424801470753411895430599515688671613945315556473988958195731285571525954751964731146155602495181333448274858587323061348443905692585079615880495229198863633236615165516997176694193370694715175642676371406146241038571666264052391691338366214251723982562011204254941450497071234968585722267832846346299066343834574016446924498584257264578181457011417552628142477713766620937261559582192639241660889841494452502568695549255247118850277245238431863837959313448820459757683184147030263814594971146369664985867668491665539314709374956293334381364518881954165311224719153498569832186175603240466330881929529136394358115668965247464252393562529510801438445254676434924652526693319527309328311015212496733751226139481627917838747894126382147522681537421954442373705139283669959548277983335645872960972240606062137053431847946119172484594357858314396210451973164722842498463986988674278315916250587466358591954578866927971277929013309377957140477324697346519787466651932967202094281833573739607555987627151899937339327711503088654335231335508451346244328544627143194323898436345868632940571294428382753659111868722734222893306950359720335442639353979458932637363111897649165720118192408840343669595031252829317592331481473165814044639726649830602535694266699444129836426115404770958268179421839924732137661660912236977361419739743027773581612434813896851110154119524445344188418424818660478443324845174813984842653968452875597657815264112013318931218161987067647893901675222129147346364119448194986952273781274676867264694817421860198490321046586036109718363750167087629929714326213468753311666852324550988552608060486650899177376890244771884628737765566881464823407738778199789148516391324596459192963476793647191461533289492656795470831213456926649673916645755163965066736711164585504172801281509952148113309579386963966927557891641617352928523851483641568911438735619718542635305942635750858033274410293175615978399061461474484380553862541519231674227155312513209021882480349587754322597136494839962916844670102666253012966427481453976221656064909520249020505382278016385797435036542841598951783410631313479213359720314535539237136629161467887053422041289745625164637086892360199837985097957222284999144919358639933147343723843995633182456418849994784748945197322316301925347031139857903939794773201764625082662845485975647742342397317397601281532163902091738676282949276780984544683510615453335147837328612487187938806844673054354180828899109986848741539867631611347124101950969986349023173166714038573968964686372837872483733261681397907380619959176958344522286211688295725078907399994248467069665690599221597965287327705823994062723374626463759598165081564433757116374415548167606774259867694390743076676517772221434247285375173148585452197333109667348880516321681922225160245548188382999325973552587862868499267621897837368691682677385527715621821843999278103081114392764825413956297479449941279283614793418488106255409655542732124172538249687089491656404613937979805199531217851128419418449169803159757731491551196655786732151946305057404991659948614260621855954050228555177145202325151147651876881615915172859890514680942665879737195026331268182780381347308326161642803335708057686622314717453321146170304118797339759683621745872497518068625132358059861352343275474647727138149372967058493291352026154818176465943294502324773428412023403368745656505844163068393629385456393672527458927231172278255868729059385154165889326811148715297024885521418459681048232182278081159293273636812059737397657560414589732957809484637716591135987537876988449135792076456120751451215652513141508319634847726623149265362988133383198998121474619622581670497692145139394652136523429560732892447957168112193342153463353720821599438748498862237896571972678771353733926076337289805349242761285965876917338278949484333871992466429993743793207375625883902730596559674753591886876051389314879914555959674020737011138743105072411942165582648217918593709038311994998040304771912113863147996149721195213847642548392685412568974357512391926836961159731939537784608144358164432665754785176677113815255124407560218533918088277071168115286759703128355263867694403564368585283184541762761279551737681480476417102189208521258738389721533549701930215924656551923040665153774370955345885561382986844690373337725854648120161669406452192875143673549651635356438028219026803844438780914355665576791875118077812163558771888274777643226172809737525940604947591619757683784675174260901777273332581110795923107011966070908856606289397370699580746112418330127565315718201946787555367351305255235220665356926399542651377388329684778947375427861884368046659899633630336350886948218332117250685762307940245558184945236230243193765582178144773828883846312121565963626753192050934946433133801435423989421497691937653976539090197789274988617765432251433529308554321329816237606593964110939450978115692789953384408444997917867628158179966346189091752856738559179797534233822298869728321132702541948541222474952623789711728375769443509023906141603983158685805434654935365843942616311143952133464415198846835431717215111138316548816512622271279840508072858233396254394423316695412044761929841942893939548994266973911472204090309912887974651863357766951588229311936578219363238241609539467214599149259578617981315977202721628598617890238678937076593566776991458114223491872879549019639115155139347530197557228553196154582960779612347970805117446531757452573069626235105835718763651077666699641075422027812934918480595029731791869092756877266141437460293633447624808249606510642881379786386884996920569926322680148873936417956961877175306465442368156656544379255648516278351223354073331277623060708218425141771630531560928766861364181058181775357052257450322096981443705356274941386043257017573671418959365750133342686877591373991570405114653953287064601787371648758269787872951752911151103930419816237863413183236452812684438968197395385169677811393124958644852710926157272526501442361689306490322413476561584084849240125172684269861237675492935551933276796436136896795024821623782162434998117680876169979364231588848953373062254228448372218566986676179153377495232888539454791330163680667922641716642375891175724582357397665257126814869017324934716012191916139665722410289484295168143117226518161019869554488898933145398267943719911968525676231492805552937437541459124216255292561658218983697865385071251415206248973991645384733915257141995470918364614874212969182062213431429662753059609737211413631795515887142221312466854663598025181368387556537244778276754768627224883922394760418721138237553647256742567088277827507797558877531059669094916251935761831045982267568160978388816919598933262742793791223019913785336086659780265398711090987447947574459021164737672135802420189033926614716290195197286118922034627446643622166727929178439410525490401991817289721180393635134798765856173239271636438034558436597162548923535636592311748552992348303789102190943561891439382472798525731151364581222375501251103654945033249095221034377170341954353941963114395277557748276155161526172522336941102554347637344183648665929054308852574749527624702042563314953855912346519844582895682115434591543816598540888034822822576698474554132264957158322170777522583284168592215125512614715119136790234919963378483826551588323899775018804541522132888545253155239726441251601540847543713848536521536332683074569418133144927891225736218871509287476419131641559052313198864215515282538084485874689625244881578889931471487123874420233687598781926994975116492521797829349171393610811392817777613850212120663814787072825994489413533385126081214786209367671049738968143921303349848710161979757886712814948778251962371061841578372539369863218639287019517957833681963440637797738726254387938612124635567622174170951290535529963220632012219837735611183566472491182284243120614924738425754556744797473439119395488424757793722735782049961282261336511577548356176989694637665871538125745770478595803234418214663340232032412829822156133021149059283912511641134964853394733482492410209224458154355916183849889269154867408397249028983147277346783026302713396283498853618515706586337188832323223254551548211460462747749035694659512524202411801015676388852275233929423325185552764317622161622650946718832045989832425934623651639784848879194983911526185495436683345287646680354118629625277984296242934932266975827934609491585460682423983354379278421311122590752150468466205446304712139964127478437039903985477346533671584144642730294744886572711798909081656237521915591552903572513934119620261193931741256573836095259573125290139199337426345265661178719569162374769733339248246852881939362447133363711613792186414716789158844998676423569148229382529018724061647631583312693273529554219265359624306770994427401960885467326194634266424521494041267336748462173420461950172436569118651477933868935864597569782997733221797071365665885575181762758092898530396759649065144028487181249335239273287360579787904797541093245610298348191159517775655134257920864510995779407744765630549594495780676692479940912026798235468474838646242784403259909081794226653274797325999788881059724359991772715847237452277589204177805362189630238290878310452291772510837395537593146612942778846754174489959726143125612947851216755266748927717283856495101391243065642572462254534995818566147414978071949652945871158890341689259158927980885680902212108188706326217251259357743263298636545730231552545760229711193531682323572559559065417737156835347886539867561750616286815022128985888723146258234778234682299131769432353771183290505894791916278618369077623144926480537398966681682239212877332222768828139963313774524839808313707337308411742960867782136544673171892729776837455656381998122987457815359831598476124985515994446688712135112137913868514552417633428622739728841411833178643032227473285542318979452732149862893647648037739359515025844663775952803246681520148829438226795568714073226841681871954466389068921150675156101240265189897957357885815061478546108572428964367095582647667835337866229060381266899415914890673191927688953123847638615996102751139990606463796840444137222710891166727438283993656946521322707234664729165184327132881673921180876360873126327786653352376616362387963454981810756299489118639595961391786639558036759351488054214582844929704823311268635926881638468369822438327573468299236555115277373061266912221885398593701229875846821551294289103391178977426535699648872322964126724856866029259863676982865780631540215946716822444176953371225745288661726471923993176661893397858514715318176459544089918595233374868236771214848827336258575047474771583642457166927388185670524192582815963140608059928472163721108868736964108758106985766818613388776120839470651427598771948480768194543021335699848787832218996714546614861954857479282374685443647636918555646172758695427655326556238949619178757918932343139435659661272135477671158434241953503731366892963482994628788616629241436562865942251147681427357984875729206440975110697455125095167624169140357394845250599964584539337919668723533415555346939632599911305916877698166623532793421216597559731858581022906356937689881917282685133729292959414722807586976988543634673791981410839480523380226350685548852732345722341242344971621389442792384918562822926522726118202922308223696140512250503697994054413279338932819514586845283261422614357113178662993511992455577552505521349441495167654723559670222543903655768762238814417323139089539879139867284099187350255445425989135216463395293942935273333474353748145160686066941636556734787472975639407564106774557974615914132785992025392862107490511344468166824697362753761571666068836221818352935454961386924596878033664816844734105053679116302975631012924445528983286112252780148583689697663714681958909274111154875591632420109911318198366047241989918043449883823796475637673518244949456387719581158489435531855443976739614591926219717891492781153964862412131753212162228886878486716329699048825113303464191692728710249057398412544484852962756216898571522235412432487338589542345010526049579610997858956373647062308223275690983599106614612730971213256253755770346353338420668552775138183927412522694462597065713690852646549538181111616985193729188933928931616186211649113292422831905089142587776672763335648165776249172330614127323723544440961135495358715764502139364493901362245733219420521890215973313244562023561321111112782870575329177124776661667486378184966670391336444728324215622426555335564956934465664848575651387657448112467850369368346064171084746031795241618566298964906065918249825266101836125629297274155026133185425372156791751120322657214919241232489641195929816586335762739096404715124723354376954260697964171582445455381413158253212720817173968981403277834567886018675112925989501096576043158690132376149443357975908175146833576051347445739884609626113713456193952364578287118279793966706130735171947525894352802222567635649684803719679463907946751561533045474149568325516095304779161529709816447240536924996882912980371198687573718439318794962426354743886021575528103050359842526612594487859742334057805998239551913882961196576076412655123856317074233566393565262386905164435330709975124146546733757595984727585335634362206022162078689161423991813842337898354146682157863152384866711863964249126248329188273564712986842717661415863058781739839592848224315340605431994972623821278859438076788722418838146377743451109510995713139771253257697227453285932456746435481385608560548557285128875338489510148193625741917718873738582467526978211110525494899866342271864667213192659972118857107477169422581023906736238193643831763555788938588335154496422673213634617684435743183828194954168150797055688337763869523329835369234780891433604615265310161547731964617272697054679914262065733120624765608770126261547180101394175774639743347361679419219287781624785587138996624662985163161736147130158143322996349954591188169191872195836667104563406982391010594976963670978152286814653940602524799727802934815533619925852446252337829286336060784365118981265538991019518666996453798345913615271827764873689986923469795868394334606459631633241641696991671668836376459397282476266992747743337696634646927367133722206032606514188759725435683175932380878787846226476042368511688787518493993341751275122720151374655662619171288720353558704277431051509446114655669335601379404447897883837122111749911212456136177392927719764888748686605695292099282081899664374139218879208244845498731198982985694163864216582425361559635661908413931957697881323736784233799196284980347981697931412929403811264867486139377132755424748222269816936389221478641627395957662024757852177065434429879286972314907185799822417894146192724556371338532052313484549569735825989898497449234659727149311162412162274874505820294692122119433887872752905353375014366844245869508858521260843117269444427847386183154658122179776276174482503776762818253139209468647660569610673133208548494843503745907332293270451361433059261092987255144669485765873748186138425366723915187190642123655034492451246024329267622353138710779619452993282398692186736550408892579598392962361027211952697578599857792452841362219161314421803099269853881976501735704486845968707322301347147555721114778179993224611019988790132133482557946026467277575868134262366585113284407369165060334667167928875237918191498944787271275058633093459040117584694539928668127549726233208112156772857643929474687243855070787780929759565552507044503356753344909061731139108459654356388945279860329649606954384069173946911653345262384678337974775197303271765758822917452785409655305273618569567199564234793724407861525329519861407959445580677981518296358358802262256820408983552326112975397432962737761941213244268638327942852748533674824070784313366625963774707975998584564029739155153077591282459160449845113042601768178487683022533731214186634673801499627498242265459880885040902818173669734265374982227522844820967966843135176184986778998829548360743030288564959152695299708319469895856161707892754538117247372253119260818820646064401415595445805711371124328116461088797360151184729857544561795618203398602";

asseq(p1(test), 1928);
asseq(p1(real), 6258319840548);

asseq(p2(test), 2858);
asseq(p2(real), 6286182965311);

type Disk = (number | undefined)[];
function createDisk(diskMap: string): Disk {
  let disk: Disk = [];
  let pointer = 0;
  for (let i = 0; i < diskMap.length; i++) {
    const blockLength = Number(nonNull(diskMap[i]));
    const blockType = i % 2 ? ("free" as const) : ("file" as const);
    const id = Math.floor(i / 2);
    // console.log("type", blockType, "id", id);

    for (let j = 0; j < blockLength; j++) {
      if (blockType === "file") {
        disk[pointer + j] = id;
      } else if (blockType === "free") {
        disk[pointer + j] = undefined;
      } else ass(false);
    }

    pointer += blockLength;
  }
  return disk;
}

function p2(input: string): number {
  const disk = createDisk(input);
  const files: { id: number; position: number; size: number }[] = [];
  let pointershit = 0;
  for (let i = 0; i < input.length; i++) {
    const blockLength = Number(nonNull(input[i]));
    const blockType = i % 2 ? ("free" as const) : ("file" as const);
    const id = Math.floor(i / 2);

    if (blockType === "file") {
      // shit try to figure out if all of these props are used.
      files.push({ id, size: blockLength, position: pointershit });
    }

    pointershit += blockLength;
  }

  // console.log(files);

  // printDisk(disk);

  for (let i = files.length - 1; i >= 0; i--) {
    const file = files[i];
    ass(file);
    // console.log("trying to move file ", file.id);

    let pointer = 0;
    let currentFreeBlock = 0;
    // shit, for perf we can maintain an index of free space, and then get the first free space which is smaller than the file size.
    while (pointer < disk.length) {
      // console.log(pointer, currentFreeBlock);
      if (typeof disk[pointer] === "number") {
        currentFreeBlock = pointer;
      }
      // printDisk(disk);
      // ass(false);
      if (pointer >= file.position) {
        break;
      }
      const shit = pointer - currentFreeBlock >= file.size;
      // console.log("shit", currentFreeBlock, pointer, file.size, shit);
      if (shit) {
        // move complete file to currentFreeblock
        for (let j = 0; j < file.size; j++) {
          // wtf, why does this need a type hint?
          const from: number | undefined = disk[file.position + j];
          asseq(from, file.id);

          const to = disk[currentFreeBlock + j + 1];
          asseq(
            to,
            undefined,
            "in disk " +
              JSON.stringify(disk) +
              " position " +
              (currentFreeBlock + j) +
              " was " +
              to +
              " but should be undefined. "
          );

          disk[file.position + j] = undefined;
          disk[currentFreeBlock + j + 1] = file.id;
        }
        if (file.id % 100 === 0) {
          console.log("progress", file.id, files.length);
        }
        // printDisk(disk);
        break;
      }

      pointer++;
    }
  }

  // console.log("\nfinished compacting disk");
  // printDisk(disk);
  return check(disk);
}
function p1(input: string): number {
  const disk = createDisk(input);
  // printDisk(disk);

  let firstFreePointer = 0;
  let lastFilePointer = disk.length;

  while (firstFreePointer < lastFilePointer) {
    if (typeof disk[firstFreePointer] === "number") {
      firstFreePointer++;
    }
    if (typeof disk[lastFilePointer] === "undefined") {
      lastFilePointer--;
    }
    if (
      typeof disk[firstFreePointer] === "undefined" &&
      typeof disk[lastFilePointer] === "number"
    ) {
      disk[firstFreePointer] = disk[lastFilePointer];
      disk[lastFilePointer] = undefined;
    }
    // console.log(firstFreePointer, lastFilePointer);
  }

  // printDisk(disk);
  return check(disk);
}
function check(disk: Disk): number {
  let score = 0;
  // console.log("checking");
  for (let i = 0; i < disk.length; i++) {
    const blockId = disk[i];
    if (typeof blockId === "undefined") {
      continue;
    }
    score += blockId * i;
    // console.log(blockId, score);
  }
  return score;
}

function printDisk(disk: (number | undefined)[]): void {
  console.log(
    disk
      .map((entry) => (typeof entry === "number" ? entry.toString() : "."))
      .join("")
  );
}
// asseq(check());