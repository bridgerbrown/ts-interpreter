# Interpreter in TS

An interpreter built in TypeScript and Jest, displayed on vanilla JS frontend and connected through websockets to Node.js backend.
[Website](https://ts-interpreter-gilt.vercel.app/)


## How was this built?

### Interpreter
Building this interpreter was definitely one of the most complicated personal coding projects I’ve done, but that made it all the more satisfying to conquer! It was built using TypeScript with Jest to test each component.

I’d like to give a huge thanks to the book “Writing an Interpreter in GO” by Thorsten Ball, which is how I learned to do all of this. Thorsten’s code was all in the GO programming language, so I had to adapt it to TypeScript by learning GO along the way. I recommend this kind of project to any programmer looking for a challenge and to open their mind into the behind the scenes of how programming languages work.

### Website
The frontend of this website was built using vanilla JavaScript for a singe page application, highlight.js for the code highlighting in the code preview page, Xterm.js for the in-browser custom terminal, Parcel for the build, and of course HTML/CSS for the sites structure and styling.

In order to keep the interpreter functionality separate, I implemented a simple WebSocket backend using Node.js and Express. This server allows seamless communication with the terminal with the benefit of protecting the frontend if the user manages to figure out how to crash the interpreter.

This websites design uses the beautiful Kanagawa coding colorscheme and the JetBrains mono font, both of which I use in my code editor, Neovim. I figured I would share with you my favorite IDE design-- after all this is what I was staring at all day while building this project!
