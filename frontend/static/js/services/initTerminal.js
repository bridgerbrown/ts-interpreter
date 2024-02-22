export function initTerminal() {
  let socket = new WebSocket("ws://localhost:8000");
  socket.onopen = function (event) {
    console.log("WebSocket connection opened");
  };
  socket.onmessage = function (event) {
    console.log("Message received from server: ", event.data);
  };

  var term = new window.Terminal({
    fontFamily: '"Cascadia Code", Menlo, monospace',
    theme: baseTheme,
    cursorBlink: true,
    allowProposedApi: true
  });
  term.open(document.getElementById('terminal'));

  document.querySelector('.xterm').addEventListener('wheel', e => {
    if (term.buffer.active.baseY > 0) {
      e.preventDefault();
    }
  });

  function runTerminal() {
    if (term._initialized) {
      return;
    }

    term._initialized = true;

    term.prompt = () => {
      term.write('\r\n$ ');
    };

    addDecoration(term);
    prompt(term);

    term.onData(e => {
      switch (e) {
        case '\u0003': // Ctrl+C
          term.write('^C');
          prompt(term);
          break;
        case '\r': // Enter
          runCommand(term, command);
          command = '';
          break;
        case '\u007F': // Backspace (DEL)
          // Do not delete the prompt
          if (term._core.buffer.x > 2) {
            term.write('\b \b');
            if (command.length > 0) {
              command = command.substr(0, command.length - 1);
            }
          }
          break;
        default: // Print all other characters for demo
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
            command += e;
            term.write(e);
          }
      }
    });
  }

  function prompt(term) {
    command = '';
    term.write('\r\n$ ');
  }

  var command = '';
  var commands = {
    help: {
      f: () => {
        const padding = 10;
        function formatMessage(name, description) {
          const maxLength = term.cols - padding - 3;
          let remaining = description;
          const d = [];
          while (remaining.length > 0) {
            // Trim any spaces left over from the previous line
            remaining = remaining.trimStart();
            // Check if the remaining text fits
            if (remaining.length < maxLength) {
              d.push(remaining);
              remaining = '';
            } else {
              let splitIndex = -1;
              // Check if the remaining line wraps already
              if (remaining[maxLength] === ' ') {
                splitIndex = maxLength;
              } else {
                // Find the last space to use as the split index
                for (let i = maxLength - 1; i >= 0; i--) {
                  if (remaining[i] === ' ') {
                    splitIndex = i;
                    break;
                  }
                }
              }
              d.push(remaining.substring(0, splitIndex));
              remaining = remaining.substring(splitIndex);
            }
          }
          const message = (
            `  \x1b[36;1m${name.padEnd(padding)}\x1b[0m ${d[0]}` +
            d.slice(1).map(e => `\r\n  ${' '.repeat(padding)} ${e}`)
          );
          return message;
        }
        term.writeln([
          'Welcome to xterm.js! Try some of the commands below.',
          '',
          ...Object.keys(commands).map(e => formatMessage(e, commands[e].description))
        ].join('\n\r'));
        prompt(term);
      },
      description: 'Prints this help message',
    },
    ls: {
      f: () => {
        term.writeln(['a', 'bunch', 'of', 'fake', 'files'].join('\r\n'));
        term.prompt(term);
      },
      description: 'Prints a fake directory structure'
    },
  };

  function runCommand(term, text) {
    const command = text.trim().split(' ')[0];
    if (command.length > 0) {
      term.writeln('');
      if (command in commands) {
        commands[command].f();
        return;
      }
      socket.send(JSON.stringify(text));
      console.log(typeof text);
      console.log(text);
      socket.onmessage = (event) => {
        term.write(event.data);
      };
    }
    prompt(term);
  }

  runTerminal();
};

function addDecoration(term) {
  const marker = term.registerMarker(15);
  const decoration = term.registerDecoration({ marker, x: 44 });
  decoration.onRender(element => {
    element.classList.add('link-hint-decoration');
    // must be inlined to override inlined width/height coming from xterm
    element.style.height = '';
    element.style.width = '';
  });
}

  var baseTheme = {
    foreground: '#F8F8F8',
    background: '#2D2E2C',
    selection: '#5DA5D533',
    black: '#1E1E1D',
    brightBlack: '#262625',
    red: '#CE5C5C',
    brightRed: '#FF7272',
    green: '#5BCC5B',
    brightGreen: '#72FF72',
    yellow: '#CCCC5B',
    brightYellow: '#FFFF72',
    blue: '#5D5DD3',
    brightBlue: '#7279FF',
    magenta: '#BC5ED1',
    brightMagenta: '#E572FF',
    cyan: '#5DA5D5',
    brightCyan: '#72F0FF',
    white: '#F8F8F8',
    brightWhite: '#FFFFFF'
  };

