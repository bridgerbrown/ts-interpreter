class Terminal {
  constructor() {
    this.socket = new WebSocket("ws://ts-interpreter.onrender.com:10000/");
    this.term = null;
    this.command = '';
  }

  initTerminal() {
    const deviceWidth = window.innerWidth;
    const mdDevice = deviceWidth <= 1000 && deviceWidth >= 768;
    const smDevice = deviceWidth <= 767 && deviceWidth >= 670;
    const xsDevice = deviceWidth <= 766 && deviceWidth >= 501;
    const mobileDevice= deviceWidth <= 500;
    
    let termCols;
    switch (true) {
      case (mdDevice):
        termCols = 70;
        break;
      case (smDevice):
        termCols = 57;
        break;
      case (xsDevice):
        termCols = 47;
        break;
      case (mobileDevice):
        termCols = 30;
        break;
      default:
        termCols = 87;
        break;
    }

    const debounce = (f, delay) => {
      let id;
      return function(...args) {
        clearTimeout(id);
        id = setTimeout(() => {
          f.apply(this, args);
        }, delay);
      };
    }

    window.addEventListener('resize', debounce((event) => {
      this.resetTerminal();
    }, 500));

    this.term = new window.Terminal({
      fontFamily: 'monospace',
      theme: this.baseTheme,
      cursorBlink: true,
      fontSize: 15,
      letterSpacing: 2,
      lineHeight: 1.2,
      rows: 20,
      cols: termCols,
    });
    this.term.open(document.getElementById('terminal'));

    document.querySelector('.xterm').addEventListener('wheel', e => {
      if (this.term.buffer.active.baseY > 0) {
        e.preventDefault();
      }
    });

    const runTerminal = () => {
      if (this.term._initialized) {
        return;
      }
      this.term._initialized = true;

      this.term.writeln(`Welcome to the Interpreter! \r\nClick inside to start typing! Press Enter to submit and Ctrl + C for a new line.`)

      this.term.prompt = () => {
        this.term.write('\r\n>> ');
      };

      this.addDecoration(this.term);
      this.prompt(this.term);

      this.term.onData(e => {
        switch (e) {
          case '\u0003': // Ctrl+C
            this.term.write('^C');
            this.prompt(this.term);
            break;
          case '\r': // Enter
            this.runCommand(this.command);
            this.command = '';
            break;
          case '\u007F': // Backspace (DEL)
            // Do not delete the prompt
            if (this.term._core.buffer.x > 2) {
              this.term.write('\b \b');
              if (this.command.length > 0) {
                this.command = this.command.substr(0, this.command.length - 1);
              }
            }
            break;
          default: // Print all other characters for demo
            if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
              this.command += e;
              this.term.write(e);
            }
        }
      });
    }

    runTerminal();
  }

  prompt(term) {
    this.command = '';
    term.write('\r\n>> ');
  }
  
  runCommand(text) {
    const { socket, term } = this;
    if (text.length > 0) {
      socket.send(JSON.stringify(text));
      socket.onmessage = (event) => {
        term.writeln('');
        term.write(event.data);
        this.prompt(term);
      }
    }
  }

  runRandomCommand(text) {
    const { term } = this;
    term.write(text);
    this.runCommand(text);
  }

  addDecoration(term) {
    const marker = term.registerMarker(15);
    const decoration = term.registerDecoration({ marker, x: 44 });
    decoration.onRender(element => {
      element.classList.add('link-hint-decoration');
      // must be inlined to override inlined width/height coming from xterm
      element.style.height = '';
      element.style.width = '';
    });
  }

  resetTerminal() {
    const { term } = this;
    if (term) {
      term.dispose();
      this.term = null;
    }
    this.initTerminal();
  }

  baseTheme = {
    foreground: '#dbd7bd',
    background: '#16161d',
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
}

export default Terminal;
