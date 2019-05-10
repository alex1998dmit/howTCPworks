
class StartState {
    constructor() {
        this.signState = "Начало";
        this.ipClient = "172.19.4.82";
        this.portClient = "54822";
        this.ipServer = "195.19.137.68";
        this.portServer = "110";
    }

    init() {
        this.changeIP();
    }

    changeIP() {        
        $("#clientId").text(this.ipClient);
    }
}

// let sum = (a,b) => { return a + b; }
export const pi = 3.14;
export const e = 2.718;

export const square = (x) => {
  return x * x;
};

export const surfaceArea = (r) => {
  return 4 * pi * square(r);
};

// export {sum};

// export {StartState};