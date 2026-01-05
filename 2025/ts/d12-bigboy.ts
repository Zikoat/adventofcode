import { asseq } from "./common";
import { bigBoy, canFitString } from "./d12";

asseq(
	canFitString(`
0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

12x5: 1 0 1 0 3 2`),
	false,
);

bigBoy();
