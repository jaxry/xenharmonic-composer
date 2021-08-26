# xenharmonica
A [xenharmonic](https://en.wikipedia.org/wiki/Xenharmonic_music), chiptune music sequencer tuned with [just intonation](https://en.wikipedia.org/wiki/Just_intonation).

The goal of Xenharmonica is to create a music composition app that works with, and corresponds most closely to, the way we percieve music.
Built with React around the Web Audio API, Xenharmonica should be easy to use, while also reinvisioning the process of music creation.

## Features

### Just Intonation 

Designed around just intonation from the ground up. Every note is expressed as a relative ratio to a base note.
Using just intonation over 12-tone equal temperment allows for more consonant sounding harmony, as well as allowing for exotic harmony using new notes not expressible with a 12-tone scale.
 
### Modulations

Built-in support for modulating the base, or tonic, note of the scale at any point in the composition. All notes will sound as ratios to this base note.
Modulating the base note allows for chord progressions and key changes, and always ensures that all other notes sound in tune.

### Reusable phrases

Phrases of any size can be composed, which can then be used and substitued as many times as desired throughout the composition.
Phrases can also accept any other phrase as arguments to incorporate, allowing for music to be built out of "functions".
This design corresponds to the way we often inherently percieve music, and allows for a fast and easy way to write down ideas.
