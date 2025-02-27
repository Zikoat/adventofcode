console.log("before import");
import { Brand } from "effect";
import { add, ass, asseq, nonNull } from "./common";
import { sleep } from "bun";

const test = `0123
1234
8765
9876`;

const test2 = `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`;

type Head = string & Brand.Brand<string>;
const Head = Brand.refined<Head>(
  (unbranded) => /^\d+|\d+$/.test(unbranded),
  (n) => Brand.error(`Expected ${n} to be a head`)
);

function getTrailHeads(input: string): Record<Head, number>[] {
  function stringToInt(input: string): number {
    ass(/^\d+$/.test(input), `${input} is not an int`);
    return Number(input);
  }

  const shit = input.split("\n");
  function getshit(coord: Vector): undefined | number | "." {
    const cell = shit[coord.y]?.[coord.x];
    if (cell === undefined) return cell;
    if (cell === ".") return cell;
    return stringToInt(cell);
  }

  type Vector = {
    x: number;
    y: number;
  };

  function vectorToHead(v: Vector): Head {
    return Head(`${v.x}|${v.y}`);
  }

  const trails: Record<Head, number>[] = [];

  for (let y = 0; y < shit.length; y++) {
    for (let x = 0; x < nonNull(shit[y]).length; x++) {
      const cell = getshit({ x, y });

      if (cell === 0) {
        const trailRoot = vectorToHead({ x, y });

        const trail: Record<Head, number> = {};
        trail[trailRoot] = 1;
        trails.push(trail);
      }
    }
  }
  function headToVector(head: Head): Vector {
    const [x, y] = head.split("|");

    return { x: stringToInt(nonNull(x)), y: stringToInt(nonNull(y)) };
  }
  for (let i = 1; i <= 9; i++) {
    for (let trailId = 0; trailId < trails.length; trailId++) {
      const trail = trails[trailId];
      ass(trail);
      const newTrailHeads: Record<Head, number> = {};

      for (const trailEntries2 of Object.entries(trail)) {
        const trailHead = Head(trailEntries2[0]);
        const score = trailEntries2[1];
        const trailHeadVector = headToVector(trailHead);
        const directions = [
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 0, y: -1 },
        ];

        const newSteps: Head[] = [];
        for (const direction of directions) {
          const nextCellLocation = add(trailHeadVector, direction);
          const cell = getshit(nextCellLocation);

          if (cell === i) {
            const newHead = vectorToHead(nextCellLocation);
            newSteps.push(newHead);
          }
        }

        // first new trailhead should have score of previous
        if (newSteps.length >= 1) {
          const newStep = nonNull(newSteps[0]);
          const previousScore = newTrailHeads[newStep] ?? 0;
          newTrailHeads[newStep] = score + previousScore;
        }

        // second and subsequeunt should have score 1
        for (let j = 1; j < newSteps.length; j++) {
          const newStep = nonNull(newSteps[j]);
          const previousScore = newTrailHeads[newStep] ?? 0;
          console.log("splitted trail", newStep, previousScore);
          newTrailHeads[newStep] = previousScore + 1;
        }
      }
      console.log(
        i,
        // "trail",
        // trailToString(trail),

        trailToString(newTrailHeads)
      );
      trails[trailId] = newTrailHeads;
    }
  }

  return trails;
}

// const testResult = getTrailHeads(test);
// asseq(
//   testResult.map((res) => Object.keys(res)),
//   [["0|3"]]
// );
// asseq(scorep1(testResult), 1);

// printTrails(testResult);

function trailToString(trail: Record<Head, number>): string {
  return Object.entries(trail)
    .map(([head, score]) => `${head}:${score}`)
    .join(", ");
}
function trailsToString(trails: Record<Head, number>[]): string {
  return `${trails.map(trailToString)}`;
}
function printTrails(trails: Record<Head, number>[]): void {
  console.log("trails", trailsToString(trails));
}
// printTrails(getTrailHeads(test2));
// asseq(scorep1(getTrailHeads(test2)), 2);
const test4 = `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`;
// asseq(scorep1(getTrailHeads(test4)), 3);
function scorep1(trails: Record<Head, number>[]): number {
  let score = 0;
  for (const trail of trails) {
    score += Object.keys(trail).length;
  }
  return score;
}
const test5 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

// asseq(scorep1(getTrailHeads(test5)), 36);
const real = `034988701278987676012129801065432105421103432103454096565
125679872367010982101036782196501234910012501012763187434
787610765456123673412345693887321045823459621029872236121
898525601595434534781076784989430896701968739438901549030
323434532786365105698985895676501765432879548567123678745
011012345645678234387654326967892123446785697621034505656
432903678932109323476763017856743014565494784543217614567
589814565021012310565892107012656019872343203894108723878
676745654108985459876901098763254321781254112765439012969
565656783212976367805419343454169430690167089678321023456
854309892107801210912378332169078944512358974389412013210
985212343056543498901263211078927653403445665278501894321
676501456545212567632154901012012102176532787165430765410
125034567430101676545013876328703291081001096012321456701
034129878921018987436980785439654387892654012965434389898
101212982982789832127821897654303476763787123878001298187
832003471073654101038936778985212565654692104569122347098
943126562364543234897645012105432894304543243321031056127
874298401459659145686541023256301783213432102458947898036
965387523458778096675632894367012654500123211067656012145
810456014560127687501701765458983523545655428985443083434
723012329875034573432892601249874012338764569876322196510
654322345676542102343789894332465621429853278701012387623
456401234987789011498778765011321290510343189652212899854
367321243453276320345662104320210987653212090343103769763
218930652454105431221323478910345898710103221202114658892
006945781367898987630014568921456787610154101213095147081
145876590201456894545679697832125456543267818344786036120
236710185102361003879788786545001445567858989655687125431
569825676509872112968795670122112344431945878743296234565
654334587412103021257654565431034498120930189650123109872
789245698343894540343403676892345567011821065211034898901
432176501256765696012512589743496578762762174300165437432
310089433212678787810103430652787789643453789421676326523
421632124501549896981254921301296545556304789034589212010
530789038678432765432367873234123403469215672105890103141
045690129879321054101234980105038912378987683216721911032
132101434564567893250125678676107667877876594569637832145
201234989433218982345614989789234554960345487678546543256
334345676521101671898703065690965433451206543287667898969
455210897010010560789782154321876522543215670196546327878
966580768954323457632692212430789011694504389231435416547
877891251067810198541521003521545600789611223410121005436
012019342301967801430435654677632780678700014521032389305
329828765432858912301646710788901891521812325672123458216
456734210876543205218769881291010132430923278989834567567
012985309987434104329454898301125673876014167575765765498
943476478932122345010343987432034984981985095434389894323
859874567841031656789252156547875675670876787625678987010
768561265434670712395161067656965787651451012510895672100
655410872354589803234078458945434590142360343422743543261
012328961043489954165439143289323212239871256321652145652
785499876672128765076721012170212103456756765410598056743
896780745589056787689831089061106787034347898507882349899
763271234432345996547642174352005498125432984678971001878
454189432521001876038983465243214323676901765489160010967
565076521010122345127654564101233010987810894321054323456`;

// asseq(scorep1(getTrailHeads(real)), 794);

// asseq(
//   scorep2(
//     getTrailHeads(`.....0.
// ..4321.
// ..5..2.
// ..6543.
// ..7..4.
// ..8765.
// ..9....`)
//   ),
//   3
// );
function scorep2(trails: Record<Head, number>[]): number {
  let score = 0;
  for (const trail of trails) {
    for (const trailHead of Object.entries(trail)) {
      score += trailHead[1];
    }
  }
  return score;
}
console.log("starting");
// await sleep(40_000);
debugger;
console.log("continueing");
asseq(
  getTrailHeads(
    `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`
  )
);
