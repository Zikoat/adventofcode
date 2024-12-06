// console.log(import.meta.file);

import { asseq, ass } from "../2023/ts/common";
import { Schema } from "effect";

const d1testinput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

const d1realinput = `1 3 5 6 8 9 12 9
66 67 70 72 73 74 75 75
18 20 22 25 28 31 35
85 86 87 90 93 99
5 6 5 7 10 12 15 16
68 70 72 73 74 73 74 71
75 76 79 76 79 79
38 41 44 45 43 47
76 77 79 80 83 85 84 90
73 76 79 79 82 85 88
86 87 87 90 93 94 97 96
47 48 48 49 49
29 30 31 31 35
85 87 89 89 90 95
33 34 38 39 40 42
84 86 90 93 92
20 22 25 29 29
76 78 81 84 85 89 92 96
47 48 52 54 57 58 59 64
19 20 21 27 28
49 51 58 59 61 59
18 21 26 29 32 32
46 48 53 54 57 58 62
71 72 73 78 80 85
25 23 25 28 29 32 35
34 32 35 38 39 40 43 42
15 14 15 18 19 19
48 47 49 51 55
9 8 9 12 19
33 31 33 34 36 37 36 37
71 68 66 68 66
86 84 86 85 86 88 88
30 27 28 27 28 30 32 36
77 76 74 75 78 85
66 63 64 65 65 67
48 45 47 49 52 52 53 50
28 26 26 27 30 33 33
26 25 25 27 28 29 33
93 91 92 92 97
36 35 39 42 43 46 47
18 15 18 22 25 22
43 41 43 46 50 52 52
28 27 30 32 33 37 41
58 56 58 62 63 65 67 73
3 1 3 8 9
28 27 30 33 34 39 38
65 64 65 68 75 75
51 48 55 57 61
57 54 61 64 65 71
26 26 27 28 31 33 34 35
37 37 40 41 43 44 47 44
41 41 43 44 47 50 51 51
32 32 34 36 37 40 41 45
32 32 35 38 40 41 42 47
79 79 80 77 78 81
91 91 89 92 95 97 99 96
86 86 83 85 88 88
37 37 36 38 42
63 63 60 61 63 66 73
43 43 43 44 47
54 54 57 57 58 57
26 26 29 31 31 33 33
21 21 24 27 27 31
9 9 10 12 14 14 15 22
41 41 44 48 49 52 53 54
16 16 18 22 24 26 25
11 11 13 17 20 20
62 62 63 65 66 70 72 76
74 74 76 78 82 85 91
72 72 75 76 81 84
12 12 14 21 24 25 26 23
6 6 8 10 15 15
10 10 11 12 14 20 24
17 17 20 21 22 29 31 36
23 27 29 32 35 38 41
34 38 41 44 43
37 41 44 47 49 50 52 52
41 45 47 48 50 51 54 58
79 83 86 89 90 91 92 99
25 29 30 33 36 39 36 38
90 94 97 94 96 99 96
84 88 86 87 88 88
48 52 55 54 58
46 50 49 51 53 59
22 26 26 27 29
52 56 59 59 56
42 46 49 49 49
62 66 66 69 70 74
64 68 69 72 72 73 76 83
10 14 17 21 22 25 26
43 47 50 54 55 52
85 89 92 96 96
58 62 66 68 69 72 74 78
8 12 16 19 24
69 73 74 80 81 82
65 69 76 77 75
16 20 23 28 31 32 34 34
41 45 48 53 55 56 60
80 84 87 92 98
69 75 76 79 81 84 85 87
27 34 36 37 36
51 57 59 60 62 62
20 27 30 33 37
39 45 47 50 51 57
65 72 75 73 74
78 83 85 87 89 86 83
50 57 60 63 62 64 65 65
39 46 47 44 48
36 41 44 42 43 49
7 14 14 17 18 21
61 66 67 67 64
66 73 74 76 76 77 77
47 53 56 57 60 60 64
38 43 45 45 52
30 36 38 41 44 48 51
26 32 35 38 41 43 47 46
79 85 87 88 91 95 95
36 43 44 46 50 52 55 59
64 69 71 74 77 81 83 88
46 51 53 54 57 59 66 68
64 71 78 81 83 80
22 29 30 35 36 36
60 66 69 74 75 79
23 28 33 36 37 39 42 48
10 8 7 6 3 1 3
69 68 65 62 61 58 58
76 74 71 68 67 63
84 81 80 78 76 70
67 66 63 65 62
35 33 30 28 31 30 32
65 62 64 63 63
95 93 91 92 88
72 70 73 70 65
69 67 67 64 62 60 58 56
69 66 66 63 65
11 8 5 5 5
53 52 49 46 43 43 41 37
19 16 15 13 13 11 4
48 45 44 41 37 36 34 33
52 50 47 46 42 44
32 29 26 22 22
29 28 24 21 18 14
64 63 59 58 56 55 48
62 60 57 51 48 45 42
43 40 39 34 35
17 16 13 12 6 5 5
85 82 75 72 71 70 66
55 52 49 42 35
8 11 9 7 4
47 49 47 44 43 40 39 42
76 78 75 73 70 67 66 66
64 66 64 63 60 58 56 52
88 91 89 87 81
35 37 40 39 36
8 11 9 11 10 11
4 7 6 4 6 6
40 42 39 36 34 32 35 31
77 79 77 76 79 76 71
92 94 91 91 90 88 86
55 56 55 54 54 53 54
38 41 41 40 40
18 19 19 18 17 13
12 13 12 10 9 9 8 3
11 14 11 10 9 5 2
36 38 36 32 31 32
12 13 10 7 6 2 1 1
81 82 80 77 73 71 70 66
17 20 16 13 11 9 8 1
34 35 32 27 26
94 96 91 90 89 90
52 54 47 44 42 41 38 38
75 78 77 71 70 66
82 84 79 78 76 73 70 63
57 57 54 53 50 49
22 22 21 19 21
81 81 80 77 76 75 74 74
65 65 64 62 60 57 53
39 39 37 34 28
18 18 21 18 16 14
10 10 7 9 12
47 47 44 46 45 44 44
69 69 71 69 66 63 62 58
84 84 81 83 81 75
73 73 71 71 68 65 62 59
47 47 47 44 41 42
86 86 84 81 80 78 78 78
83 83 83 81 77
36 36 33 33 32 27
65 65 62 58 56
77 77 76 73 70 66 63 64
61 61 60 57 53 53
22 22 19 15 11
52 52 49 45 43 38
71 71 70 67 65 60 58
28 28 26 23 21 16 13 16
89 89 86 80 77 75 72 72
81 81 80 79 74 70
84 84 83 80 79 72 66
92 88 87 84 83 81 80 79
83 79 76 74 73 74
77 73 70 68 66 66
34 30 29 26 23 21 18 14
34 30 28 26 25 20
53 49 47 45 43 44 42
65 61 62 61 64
95 91 90 91 91
95 91 90 93 91 87
95 91 89 86 84 83 86 80
26 22 22 20 17 14 11
30 26 24 21 19 19 16 19
37 33 30 27 27 27
20 16 14 14 10
76 72 72 69 64
70 66 65 61 59 57 55
59 55 51 48 51
84 80 76 73 73
81 77 76 72 68
95 91 87 86 80
57 53 52 51 50 44 41 39
29 25 19 16 15 17
41 37 32 29 29
63 59 58 56 49 47 46 42
23 19 12 11 4
35 29 26 24 23 22
64 59 56 53 52 49 51
52 47 44 43 41 41
25 18 16 15 12 10 6
25 19 17 15 13 12 9 2
76 71 73 70 68 67
58 51 50 47 50 51
70 65 62 59 58 57 58 58
19 12 9 6 5 7 3
85 78 79 78 77 76 71
85 78 78 75 74 71 68 65
97 92 91 90 90 88 85 86
62 56 53 51 51 51
80 75 72 72 69 66 62
89 83 83 80 79 72
58 51 47 46 43 40
95 90 88 84 86
78 73 70 66 66
60 53 49 46 45 41
55 48 47 43 38
21 15 14 11 9 4 2
60 54 51 46 47
50 44 42 35 32 30 30
27 21 19 16 10 6
53 47 41 39 38 37 32
54 56 59 61 62 59
3 4 7 9 12 13 16 16
17 19 21 24 27 31
23 26 27 28 35
18 21 22 24 21 24 25 26
53 55 53 55 54
14 17 19 20 17 18 18
78 81 82 83 81 84 87 91
65 66 68 66 68 75
32 34 34 37 39
40 42 43 46 46 47 44
58 59 61 61 61
54 55 57 57 61
24 25 25 27 30 32 35 41
70 71 75 77 80 83 85 87
79 82 84 85 88 91 95 93
82 83 85 88 92 94 95 95
35 37 41 43 46 50
60 61 64 67 71 77
4 7 10 17 18 19
28 31 37 38 37
73 74 76 82 83 83
54 57 59 62 69 72 73 77
43 44 46 53 56 61
44 41 42 44 46 47 48 51
83 81 82 85 87 89 86
50 49 51 54 56 58 58
41 38 39 42 45 48 49 53
10 8 11 14 19
74 73 72 74 77 80
27 25 26 27 24 21
15 12 15 12 12
68 66 68 66 70
44 43 42 44 45 50
85 84 85 88 88 91 93
19 16 18 18 16
50 49 49 50 53 53
69 66 69 72 75 78 78 82
31 30 32 33 33 36 41
74 72 73 76 80 82 83
82 79 82 85 86 90 87
33 31 34 35 39 40 40
45 42 44 46 48 52 55 59
45 44 48 51 54 60
46 44 49 52 54
34 31 37 38 40 41 39
78 77 78 85 87 88 89 89
30 29 32 37 41
51 50 51 54 57 63 70
57 57 58 61 64 66 69 72
35 35 37 38 39 42 43 41
33 33 36 37 39 41 41
62 62 65 66 70
68 68 71 74 76 79 81 87
6 6 7 9 12 13 10 12
82 82 79 82 81
13 13 15 13 13
13 13 15 17 15 17 21
47 47 50 47 50 52 57
60 60 60 62 63
61 61 62 62 64 66 67 64
50 50 51 51 51
59 59 59 61 64 68
24 24 24 26 29 36
72 72 76 79 81 82
52 52 56 58 55
32 32 33 37 38 38
81 81 84 87 91 95
47 47 51 53 60
39 39 42 44 47 52 55 56
43 43 49 50 53 55 52
78 78 81 84 87 93 93
46 46 47 50 56 57 60 64
41 41 44 50 53 58
53 57 59 62 63 66 69
83 87 90 92 95 98 99 96
49 53 55 57 59 61 61
63 67 68 71 75
77 81 82 85 87 89 95
34 38 40 42 41 42 45 46
8 12 14 16 17 19 18 16
48 52 50 53 54 56 56
4 8 6 8 12
42 46 49 50 49 51 56
39 43 46 47 47 48
77 81 83 83 82
55 59 60 62 62 65 67 67
36 40 42 42 43 44 46 50
66 70 73 76 79 79 82 88
35 39 40 44 45 48 49 52
72 76 77 81 79
37 41 45 48 48
36 40 43 47 51
71 75 77 81 86
18 22 29 30 31 33
33 37 40 43 49 50 47
25 29 32 34 41 41
60 64 67 73 77
36 40 42 47 50 53 54 60
52 57 59 62 63 64
10 17 20 23 20
26 32 35 38 40 43 44 44
78 83 85 88 90 94
47 52 54 55 57 63
74 79 82 85 82 85
86 92 93 95 92 90
42 47 48 50 53 50 50
62 68 71 70 74
71 78 81 80 82 83 84 90
39 44 44 46 47 49 50
31 36 38 38 37
23 30 32 32 34 37 37
19 26 29 30 30 34
76 83 83 85 88 89 96
58 65 67 70 71 75 77 79
76 83 85 88 92 95 96 94
53 60 64 66 68 68
35 41 43 47 48 52
50 57 61 62 64 70
32 39 40 41 44 50 51
72 77 84 85 87 88 86
25 32 38 39 41 42 45 45
15 21 24 26 33 37
35 41 46 48 49 50 55
61 58 57 54 56
28 26 23 22 19 16 13 13
54 51 49 46 42
41 38 37 36 29
91 89 87 84 83 84 81
92 91 90 91 90 89 90
87 86 88 87 87
34 31 29 30 29 26 22
47 44 43 40 38 36 37 32
69 66 63 60 58 58 56
10 7 6 4 4 2 3
79 76 76 73 73
60 59 59 56 54 51 47
33 31 28 28 23
29 27 26 23 22 18 16 15
60 58 54 52 51 48 49
43 41 37 35 33 31 31
41 40 38 34 33 30 26
89 88 85 81 76
34 31 26 25 24 22 19 18
92 89 84 82 79 77 80
26 23 21 20 17 14 8 8
53 51 50 47 41 37
24 23 20 14 13 8
29 31 28 26 24
53 54 53 52 50 47 46 47
76 78 75 74 72 69 66 66
69 71 69 66 64 62 58
58 61 59 58 56 50
54 57 54 52 50 52 51
38 39 41 38 36 37
12 14 11 9 6 4 5 5
35 37 36 34 35 33 32 28
10 11 9 12 11 10 8 3
23 25 23 23 20 17 16
75 76 76 74 72 69 70
58 60 57 54 54 52 52
6 9 6 6 2
40 43 43 41 39 33
75 76 72 69 68 67
40 41 40 36 39
83 85 84 81 77 74 74
26 28 24 21 19 15
27 30 26 24 22 21 19 13
50 53 52 51 45 42
50 52 49 43 41 42
23 24 23 20 19 12 11 11
52 54 52 47 45 42 38
70 71 64 61 54
65 65 62 61 58 55
14 14 11 8 5 4 7
52 52 51 48 46 46
99 99 98 97 94 90
54 54 53 52 46
48 48 47 45 47 45
64 64 61 64 67
23 23 22 21 23 22 22
75 75 74 76 73 70 66
25 25 26 25 23 21 19 13
74 74 72 72 71
75 75 73 70 70 72
94 94 92 89 89 88 88
27 27 24 24 22 20 17 13
59 59 59 58 56 51
44 44 41 37 36 33
14 14 12 9 8 4 5
74 74 71 67 67
25 25 21 18 15 13 12 8
60 60 56 53 47
39 39 37 34 33 30 24 21
60 60 59 58 51 54
24 24 21 18 11 8 6 6
62 62 59 52 50 48 45 41
42 42 40 39 33 32 26
14 10 8 7 5 2
69 65 63 62 61 60 59 61
55 51 48 46 43 42 42
38 34 31 29 28 25 21
29 25 22 21 19 18 17 11
55 51 50 51 48 47 45 42
87 83 82 85 84 85
42 38 35 32 33 31 31
29 25 23 20 18 15 16 12
87 83 84 81 78 72
25 21 19 17 17 16 14 13
68 64 62 59 57 57 58
86 82 80 80 80
94 90 90 87 84 81 77
64 60 59 58 56 56 54 49
89 85 81 78 76 73
63 59 55 53 50 53
68 64 61 60 57 53 51 51
57 53 51 49 45 42 41 37
57 53 51 48 44 41 36
77 73 70 64 63
37 33 31 28 25 19 17 19
34 30 27 24 19 19
67 63 61 56 55 52 48
90 86 79 77 71
45 40 39 38 36 35 32 29
21 15 12 11 12
27 21 19 18 17 16 16
94 88 85 84 82 81 80 76
93 87 84 83 80 73
59 54 53 56 55
86 79 81 79 77 75 76
80 73 74 71 71
14 7 5 3 5 1
95 89 91 88 83
85 79 79 76 73
97 92 89 87 87 85 88
50 44 44 41 39 38 35 35
37 32 32 29 27 26 22
87 82 82 79 76 74 68
43 37 35 34 30 29
35 30 27 23 22 19 16 17
74 67 65 61 60 59 57 57
82 76 73 69 67 66 62
57 52 49 45 42 41 36
36 29 22 20 17
45 40 37 31 34
37 31 29 22 20 20
64 59 52 51 48 44
23 17 11 10 8 1
45 50 52 53 56 60 67
5 9 7 10 9
34 40 44 46 48 49
34 34 36 42 44 45 49
67 62 63 60 59 53
43 43 40 36 33 32 32
90 86 84 80 77 74 71 64
74 75 77 79 84 86 89
37 35 37 40 42 43 47
91 84 82 79 76 75 74 68
31 26 24 22 21 21 21
24 22 21 20 16 16
18 14 12 11 8 4 4
70 77 78 81 83 85 87 93
36 30 26 23 23
39 39 37 34 34 31
42 38 39 36 35 34 30
13 14 16 17 14 13
18 18 16 14 10 8 7 2
71 74 75 78 79 82 81
56 55 59 60 62 65
32 28 26 24 24 25
8 12 14 18 20 22 25 25
81 85 86 84 91
61 62 65 66 71 75
27 21 22 19 16 13 11 11
1 5 6 7 11 14
87 86 83 81 74
69 76 76 77 79
19 17 21 24 25 28 28
36 30 29 25 23 26
67 67 69 74 76
63 67 70 70 74
69 69 67 64 61 59 61
80 78 75 72 69 67 63
43 43 44 45 48 48 51 51
60 64 67 68 71 72 73 72
26 33 34 36 38 45 44
99 99 97 94 90 87 85 88
70 77 79 80 84
38 38 41 42 40
49 49 50 51 53 57 60 59
82 82 81 81 80 79 82
15 15 16 18 20
82 80 77 80 84
14 18 18 20 21 18
25 25 22 19 14
92 91 89 90 87 87
82 78 77 75 77 77
32 27 25 20 17 15
91 84 78 77 74 73 76
50 48 51 51 53 55
57 53 50 49 48 46
84 80 78 75 71 68 64
84 78 77 74 71 69 66 66
26 27 24 23 22 18 14
80 78 77 76 69 72
90 86 83 81 80 80 79 79
56 49 48 50 49 46
36 40 41 44 49 51 54 60
77 79 80 83 84 87 91 98
81 80 83 88 92
38 40 39 38 35 38
20 17 16 14 11 10 6 2
68 69 73 76 79 83
72 68 66 64 64 62 60
56 63 63 65 66 67 69 69
7 11 13 13 15 16 16
19 25 28 30 33 40 42
86 86 84 77 78
26 26 23 21 19 20 19 14
23 23 24 26 27 29 33 37
25 28 25 22 20 17 13
95 95 93 90 88 83 81 75
53 53 55 60 63 65 68 67
76 77 76 77 79 82 83 85
51 51 50 49 48
58 58 54 53 52 50 48 45
26 28 26 23 23 22 18
16 16 20 23 26 29 31
21 25 27 29 35 39
71 70 76 78 81 83 84 81
97 91 88 88 85 82 81 83
76 76 78 81 82 84 87 93
75 72 67 64 62
48 45 46 49 52
29 25 22 18 16 14
68 75 75 77 79 80 87
69 67 64 63 56 56
74 80 81 81 82 84 86 83
89 90 90 93 97
17 17 16 19 18 17 14
12 8 7 4 2 5
93 89 87 81 78
88 88 91 91 93 91
50 46 39 38 40
87 90 89 85 84 83 83
26 24 28 31 33 34 32
22 18 17 16 15 15
66 65 69 70 71 73 80
82 83 84 81 81
97 97 98 96 93 90 91
67 67 69 67 70 73 76 83
9 9 13 16 16
79 73 71 68 64 61 57
17 17 19 21 23 23 28
60 63 60 59 58 55 53 53
28 35 36 37 40 43 46 43
57 52 51 48 46 48
83 82 84 82 84 84
24 23 23 20 19 19
38 38 36 33 26 23 23
26 31 34 37 41 43 47
31 34 32 31 28 21 19 22
68 72 74 74 75
51 52 50 48 46 39 35
91 94 92 90 86 83 81
37 33 32 28 29
36 36 29 26 22
52 53 55 52 50 44
19 26 28 29 32 35 37 39
79 81 81 82 88
47 47 49 51 54 57 59 59
55 55 52 49 45
84 80 82 81 79 78 76 74
35 28 25 25 22 19 12
76 82 79 80 80
90 90 87 87 85 84 83 78
77 84 86 88 88 92
17 17 16 15 15
34 37 36 33 32 33 31 27
73 70 73 76 82
62 68 69 72 78 79 79
42 41 39 38 32 28
69 66 69 68 64
47 51 48 50 51 54 58
53 57 60 63 64 65 71
43 43 43 42 41 40 37 33
69 66 64 67 74
67 71 72 73 75
13 11 12 15 16 19 19
61 64 59 58 55 52 49 44
57 56 55 52 50 47 48
24 28 30 33 38 39 38
78 75 72 70 70 68 71
57 59 61 64 67 70 73
13 16 19 21 22 25
18 16 15 12 9
17 18 20 23 24 26
63 66 68 69 70 72 75
36 38 40 43 44
37 40 42 43 44 45 48
44 42 39 37 35 34
11 8 7 5 2
52 54 55 57 58
16 17 18 20 23 25 26
87 86 83 80 77 74 73
16 19 22 24 26 29 31
29 31 33 36 37 39
46 43 42 40 37 34 33 32
84 87 90 91 93 95
49 51 54 55 58 60
63 61 59 58 56 53 50
9 11 12 13 16 18 21 22
61 60 59 58 56 55
73 74 76 79 82
88 90 93 95 96 99
56 58 61 64 67 70
82 79 78 75 72 70 69
2 3 4 5 6 8
32 31 28 27 24 23 22
65 64 61 58 57 55
57 55 52 49 46 45 43 40
57 56 53 51 49 47 45
2 4 5 7 8 10 11
71 69 67 65 64 61 59
46 48 49 51 53 55
74 73 70 68 65 62
62 64 65 68 71
37 35 32 31 28 25 23 20
58 57 54 51 48 45 42 40
66 68 69 71 74
4 7 9 12 14 17 19 22
42 45 48 51 52 54
50 52 53 56 57 58
52 51 50 49 47 46 45 42
53 51 49 48 46 43 40
91 90 87 84 83 80 77
87 84 82 79 78
17 18 19 22 25 27 29 32
94 91 88 87 86 84
90 91 92 93 95 98
4 6 9 11 13
79 81 84 87 89 92 94 96
42 40 37 36 34 32 29 28
70 71 72 74 76
22 25 28 30 33 36 38 41
52 54 57 60 62 63
72 71 69 66 63
18 15 13 11 8 6 3 1
31 28 26 23 21 19 18 17
52 54 56 59 60 63 65
5 7 8 9 10 12 14 17
93 92 89 88 85
75 73 70 69 68 67 64
18 19 21 22 25
31 34 36 39 41 44 46
97 96 94 92 90 87 84
28 26 23 21 18
21 18 15 14 13 11
13 16 17 19 20
49 46 43 40 38 35
72 69 67 65 63 62 59 56
60 57 54 52 50 49 46
37 40 41 42 43 46 47
59 61 64 65 67
33 31 28 25 22 19 18 17
2 3 4 7 8 10 12
82 80 79 76 74 71 69 68
45 42 39 38 37 34 31 30
40 41 43 44 47 50
40 41 42 44 45
75 78 80 81 84 85
32 34 35 37 39 40 41 44
51 49 47 44 43 42 40 37
35 38 41 42 45 47 48 51
33 34 35 37 38 40 42 43
41 38 35 33 31 28 25 22
64 67 69 70 71 73 74
62 63 65 67 68 70 73
92 89 88 85 82
18 15 12 9 8 5 3
48 50 52 55 56 57
56 54 52 50 47 44 43 41
82 83 85 88 89 90
68 70 72 74 77 78
28 26 24 22 21 19 17 15
86 87 89 90 93 94 95
48 47 46 43 40 38 36 34
42 39 37 35 33 31 29 26
75 78 81 84 86 88 91
97 96 94 93 90
32 33 36 37 38
31 28 27 24 21 18 15 14
90 91 93 96 98 99
72 75 76 79 81
26 29 31 33 34 35 36 38
43 42 39 38 37
23 20 17 15 14
82 83 86 89 92 95
14 12 11 9 6
70 71 72 73 74 77
74 77 80 81 82 83 86 89
59 61 63 65 68 71 72
69 70 72 75 78 79 81
51 54 56 59 62 64 65 68
83 85 87 88 89
83 84 87 90 91 94 95
59 57 54 53 50
16 14 12 9 6 3
72 69 67 64 62 61 58 57
99 96 95 94 91 89 86 83
45 42 40 39 36
65 66 67 70 73 74 76
39 42 45 48 49 52
64 61 60 57 55 54 51 50
42 39 36 34 31 30
28 31 32 33 34 36 39 40
38 40 43 45 46 47 50
95 94 91 89 87
38 41 43 45 46 48 51 54
49 48 45 44 43 40 39 37
5 8 10 12 15 18 19 22
34 35 37 39 41 42
65 66 67 68 71
42 39 36 34 33 32
81 78 77 75 72 69
60 59 58 55 53 51
79 80 82 84 85 88 91
79 76 73 70 67 64 62
99 96 95 92 91 88 87
15 14 11 9 7 6
11 9 8 6 3
38 41 43 44 46 48
30 31 32 34 36 37 38
80 83 84 87 89
39 37 36 34 33
38 35 32 30 28 26 25
42 40 38 36 33
54 56 59 61 63
8 11 13 15 16 19 22
75 77 80 82 83 86
17 20 23 24 27 28 30 33
76 77 79 80 82 84
33 36 39 42 43 46 49 50
16 18 20 22 25 28
44 46 49 51 53
39 41 44 46 47
75 76 77 78 80 83 85
8 11 12 14 17 20 22 23
64 63 60 58 57 54 53 51
59 61 63 64 65 66 67 68
43 41 38 35 32 29 26 23
79 78 76 74 72 70 67
35 37 40 43 45 46
4 5 6 8 10 12
34 32 29 28 25 23 21
60 62 64 67 70 71
40 38 37 35 33 32 30
67 70 73 75 78 80 83 84
34 35 38 40 42
26 28 29 30 33
55 53 50 48 47 46 43 41
57 54 52 50 48 45 42 39
57 59 62 65 67
25 27 28 29 31
4 5 6 7 10 12 15
59 62 65 67 68 70
33 30 28 27 26 24
30 28 27 26 23
29 32 34 35 36
73 70 69 67 64 61
59 60 61 63 66 67 70
63 61 58 57 54
48 49 52 53 55
54 53 50 49 48 47 46
26 23 21 19 17
29 28 26 25 23
25 23 21 20 18 15 13 10
76 74 72 69 66
98 95 92 89 86 84 81 79
90 87 86 84 82 79 76
48 51 54 55 57 58 60 61
93 92 91 89 86 84 83
16 14 13 10 7
44 41 39 38 37
85 82 79 77 75 74 73
14 16 19 21 23
61 58 57 56 54 51 48 47
19 21 22 25 26 27 28 29
74 72 69 68 66 63 61 60
56 58 60 62 64 65
56 55 53 51 49 48 47 45
78 80 81 84 85 86
28 26 25 22 20 17 16
47 49 52 53 55 58
90 91 93 94 95
9 12 15 16 18 21 22 25
57 55 54 53 50 48 47
77 79 81 83 85 87 90
42 39 37 34 33
87 84 83 80 77
21 19 17 16 15 12
58 61 63 65 68 71 72
46 49 50 51 54 56 57
61 58 57 54 51 48
18 21 23 26 29 31
80 77 74 73 71
85 83 82 80 79 78 75
94 93 90 87 85 83 81 80
50 48 47 46 45 44 43
32 31 29 28 26 23 21
90 89 88 87 85
63 61 60 58 56 55 54
84 81 80 77 75 74
86 83 82 80 79 76 75 74
53 55 58 60 62 65 66
84 85 86 89 90 93
18 16 13 12 11
13 15 16 18 20 23 25 26
7 10 11 13 14
81 80 77 76 74 73 71
9 8 7 4 3
61 63 65 67 68 70 72
5 6 8 11 12 14 16
54 57 59 60 62 64 65
25 28 31 32 33 36 38 40
82 79 77 75 72 70 67 66
84 81 79 77 76
6 8 11 14 17 18 21 22
12 15 17 20 21 24
81 84 86 87 88 91
43 45 46 48 50 51 52 54
57 56 53 51 50 49 47 46
65 64 63 61 59 58 56 54
40 37 35 32 30 29 27
82 79 77 76 74 71
45 42 41 39 36 34 33
20 23 25 27 28
42 43 46 48 49
42 45 47 49 50 53 56
66 65 64 62 59 57 54
49 48 46 44 41 39 38
38 35 34 32 31 29 28
22 23 26 27 29
67 65 63 60 57 54
20 22 25 27 28 30 33 36
20 23 24 25 26
69 71 72 73 74 76 79 81
77 74 73 72 69
3 5 8 10 11 12 13 14
47 46 43 41 38
10 11 12 14 15 17
18 17 15 12 11 8 5
35 37 40 41 43 44 45
19 20 22 24 26 27 28
70 69 67 64 61 59 57 56
83 82 80 78 75 73 72 71
51 48 47 44 42 41 40
66 68 70 73 74
93 91 90 88 85
11 9 8 7 6
40 37 35 33 32 31 28
25 27 29 32 35
35 36 38 39 41
40 42 45 47 50 51 54
49 52 54 56 57 60
49 52 53 56 58 61 63 66
64 62 59 57 56
63 64 65 66 67 68
70 72 73 75 78
82 79 78 75 73
67 66 65 63 61 60 58 55
4 5 7 9 11 13
71 69 67 65 63 60 57
90 87 84 83 82 80 77 74
31 28 25 23 21 19 17
48 51 52 55 57 59 62
36 34 31 30 27 25
26 29 31 32 33 36
44 43 40 38 37
62 65 68 70 73 75
61 62 64 65 68 69 72
57 60 63 66 68 71 73
35 37 39 40 42 43 45
93 91 90 87 85
24 23 21 20 19 17 15 13
82 83 84 85 88
30 31 32 35 37
32 31 30 29 28 26 23 21
57 55 53 52 49
62 65 66 67 68 70
64 65 68 69 70 73
56 57 60 63 66 67 68 70
12 14 17 19 22 24 25 27
38 35 32 30 28 25 22 20
73 75 76 77 79 82 83
31 29 26 23 20
25 26 27 30 33 34
18 17 14 11 8 6
25 23 22 20 17
55 56 58 59 62 64 66
79 80 82 85 88 89 91 92
68 67 65 62 60
84 87 88 89 92 93 96
30 32 33 35 38 41 44
86 85 82 81 79 76 75
48 47 44 42 40 38
72 71 69 66 63 62
46 45 43 41 39 37
44 42 41 40 39 38 36 33
23 22 20 19 18
29 30 32 33 36 38
35 34 31 28 27 25 23 21
54 52 50 47 45 44 43
96 93 90 89 87
76 77 78 81 84 86
13 15 16 19 22
58 60 61 63 64 66 67
78 77 76 74 73 71
35 38 41 44 47 49
73 74 76 77 78
28 26 24 23 22 21
49 51 52 55 56
88 91 92 95 96 99
85 88 90 93 94
73 76 78 80 81 83 84
38 35 33 32 31 29
32 29 26 23 22 20 18 16
70 69 68 65 62 59 57 54
80 79 76 73 70
12 10 9 7 6
75 72 71 69 67
64 61 59 58 57 56
88 90 92 95 96
58 60 63 64 66
99 96 95 92 91 90 89 87
16 17 19 22 24 25 28
77 79 81 84 85 86
28 26 23 21 19 18
82 81 80 79 76 74 73 70
76 75 74 73 71 70 69 68
94 92 91 88 85
11 12 13 14 17 18 20
74 73 71 69 67 65 62 61
25 26 27 28 30 32 35
61 64 67 68 70 73
58 56 55 54 51 50
69 66 65 64 61 59
47 50 53 55 56
26 25 22 19 16 14 12 11
51 52 54 57 60 61
60 59 56 55 54 52 51
46 47 50 53 54 57 59 61`;

function p1(input: string): number {
  let score = 0;

  const parsed = parse(input);
  for (const report of parsed) {
    if (areLevelsSafe(report.levels)) {
      score++;
    }
  }
  return score;
}
function areLevelsSafe(levels: readonly number[]): boolean {
  const derivative: number[] = [];
  for (let i = 1; i < levels.length; i++) {
    const element = levels[i];
    const prev = levels[i - 1];
    ass(element);
    ass(prev);
    derivative.push(element - prev);
  }
  // console.log(derivative);
  const max = Math.max(...derivative.map(Math.abs));
  const min = Math.min(...derivative.map(Math.abs));
  return (
    Math.sign(Math.max(...derivative)) === Math.sign(Math.min(...derivative)) &&
    Math.abs(min) >= 1 &&
    Math.abs(max) <= 3
  );
}

const Reports = Schema.Array(
  Schema.Struct({ levels: Schema.Array(Schema.Number) })
);

function parse(input: string) {
  const reports = input.split("\n");
  const reportsArray = [];

  for (const report of reports) {
    const levels = report.split(" ");
    const levelsArray: number[] = [];
    for (const level of levels) {
      ass(/^\d+$/.test(level), `${level} should be an int`);
      const levelNumber = Number(level);
      levelsArray.push(levelNumber);
    }

    reportsArray.push({ levels: levelsArray });
  }

  return Schema.encodeSync(Reports)(reportsArray);
}

asseq(parse(d1testinput), [
  { levels: [7, 6, 4, 2, 1] },
  { levels: [1, 2, 7, 8, 9] },
  { levels: [9, 7, 6, 2, 1] },
  { levels: [1, 3, 2, 4, 5] },
  { levels: [8, 6, 4, 4, 1] },
  { levels: [1, 3, 6, 7, 9] },
]);

asseq(p1(d1testinput), 2);

asseq(p1(d1realinput), 359);

function p2(input: string): number {
  let score = 0;

  const parsed = parse(input);
  for (const report of parsed) {
    // console.log(report.levels);
    if (areLevelsSafe(report.levels)) {
      score++;
    } else {
      for (let i = 0; i < report.levels.length; i++) {
        const element = report.levels[i];
        const levelWithValueRemoved = report.levels
          .slice(0, i)
          .concat(report.levels.slice(i + 1, report.levels.length));

        // console.log(levelWithValueRemoved);
        if (areLevelsSafe(levelWithValueRemoved)) {
          score++;
          break;
        }
      }
    }
    // console.log(score);
  }
  return score;
}

asseq(p2(d1testinput), 4);

asseq(p2(d1realinput), 418);
