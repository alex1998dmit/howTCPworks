export default class StartState {
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