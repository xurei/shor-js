🏗🏗🏗 DISCLAIMER: this is still a work-in-progress 🏗🏗🏗


"What I can't code I don't understand"

# shor-js
This is a classical implementation of [Shor's quantum algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm).

This is an educational repository. It is obviously **NOT FAST AT ALL**, and not meant to be.

### How does it work ?

In the *dumbest* way possible: by doing all the computations for each possible value of a n-bit word. 
Hence, performance is really slow, and the memory required grows exponentially. 
This is really not an efficient classical way to factor a number.

But it helps understand the fundamentals of the algorithm.
A lot of logging is done to ensure maximized comprehension. Don't thank me. 

### But Why JS ? It is so slow ?

I chose JS because it's a language I'm mastering and that has useful prototyping features for fast drafted code.  
Besides, a classical computer is anyway a very inefficient way to implement Shor's algorithm.
A little bit slower won't harm at this point.
