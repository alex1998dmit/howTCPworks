// Utils -----
function clearArea() {
    $( "button" ).remove();
    $(".state-sign").remove();
    $(".client-sign").css("border-bottom", "0px solid green");
    $(".server-sign").css("border-bottom", "0px solid green");	
    $(".arrow").css("opacity", "0.1");
}

function generateRandomSeq() {
    let min = 1;
    let max = 65555;
    return  Math.round( min - 0.5 + Math.random() * (max - min + 1));
}
// -----------------------------
// Start state 
class Main {

    constructor() {
        this.state = new BeforeStart(this);
        this.signState = "";
        this.ipClient = "172.19.4.82";
        this.portClient = "54822";
        this.ipServer = "195.19.137.68";
        this.portServer = "110";
        this.seq = 0;
        this.ack = '-';
        this.side = "client";
        this.arrow = "first";
        this.cli = [];
        this.srcPort = this.portClient;
        this.dstPort = this.portServer;
        this.clientStatus = "";
        this.serverStatus = "";
    }

    clickFirstButton() {
        clearArea();
        this.state.clickFirstButton();
    }

    clickSecondButton() {
        clearArea();
        this.state.clickSecondButton();
    }

    render(){
        this.changeStatusSign();
        this.showIPs();
        this.showSide();
        this.showArrow();        
        this.changeClientStatus();
        this.changeServerStatus();
    }

    changeStatusSign() {
        $("#status-signs").html(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    showIPs() {        
        $("#clientId").text(`${this.ipClient}:${this.portClient}`);
        $("#serverId").text(`${this.ipServer}:${this.portServer}`);
    }

    showSide() {
        $(`.${this.side}-sign`).css("border-bottom", "4px solid green");	 
    }

    showArrow() {
        $(`.arrow`).css("opacity", 0.1);
        $(`.arrow-${this.arrow}`).css("opacity", "1");
    }

    changeTable() {
        $("tbody").append(`
            <tr>
                <td class="table-seq">${this.seq}</td>
                <td class="table-ack">${this.ack}</td>
                <td class="table-src-port">${this.srcPort}</td>
                <td class="table-dst-port">${this.dstPort}</td>
                <td class="table-cli">${this.cli.join(', ')}</td>
            </tr>
        `);
    }

    changeClientStatus() {
        $(".client-sign h6").text(this.clientStatus);
    }

    changeServerStatus() {
        $(".server-sign h6").text(this.serverStatus);
    }

    setParamsDefault() {
        this.signState = "";
        this.ipClient = "172.19.4.82";
        this.portClient = "54822";
        this.ipServer = "195.19.137.68";
        this.portServer = "110";
        this.seq = 0;
        this.ack = 0;
        this.side = "client";
        this.arrow = "first";
        this.cli = [];
        this.srcPort = this.portClient;
        this.dstPort = this.portServer;
        this.clientStatus = "";
        this.serverStatus = "";     
    }
}
// -------------------------------------------------------------------
class BeforeStart {
    constructor(mainState) {
        this.mainState = mainState;
    }

    clickFirstButton() {
        this.mainState.state = new StartState(this.mainState);
        this.mainState.render();      
    }
}
// -------------------------------------------------------------------
class StartState {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.addButtonForSynRequest();
    }

    setParams() {
        this.mainState.signState = "Начальное состояние, подготовка к соединению, создание исходного порта для связи с известным удаленным портом";
        this.mainState.arrow = "first";
        this.mainState.seq = generateRandomSeq();
        this.mainState.cli = ["SYN"];
        this.mainState.changeTable();
    }

    clickFirstButton() {
        this.mainState.state = new SendFirstFlags(this.mainState);
        this.mainState.render();
    }

    addButtonForSynRequest() {
        $("#start-state-button").append(`<button type="button" id="send-first-flag-button" class="btn btn-primary first-button">Send SYN</button>`);
    }
}
// ---------------------------------------------------------------------------------
class SendFirstFlags {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
    }

    setParams() {
        this.mainState.signState = "Клиент выполнил запрос на создание TCP-сессии. Отправлен SYN-запроc)";
        this.mainState.side = "server";
        this.mainState.clientStatus = "SEND-SYN";
        this.renderAcceptButton();
        this.renderRejectButton();
    }

    clickFirstButton() {
        this.mainState.state = new ServerReceived(this.mainState);
        this.mainState.render();
    }

    clickSecondButton() {
        this.mainState.state = new ServerRejectSynState(this.mainState);
        this.mainState.render();
    }

    renderAcceptButton() {
        $("#start-state-button").append(`<button type="button" id="received-syn-server" class="btn btn-success first-button">Accept</button>`);
    }

    renderRejectButton() {
        $("#start-state-button").append(`<button type="button" id="reject-syn-server" class="btn btn-danger second-button">Reject</button>`);
    }
}
// ---------------------------------------------------------------------------------
class ServerReceived {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.renderAckAndSynButtons();
    }

    setParams() {
        this.mainState.signState = "Сервер получил сегмент, запомнил номер последовательности и создал сокет для обслуживания нового клиента.";
        this.mainState.side = 'server';
        this.mainState.arrow = 'second';
        this.mainState.serverStatus = 'SYN-RECEIVED';
        this.mainState.srcPort = this.mainState.portServer;
        this.mainState.dstPort = this.mainState.portClient;
        this.mainState.ack = generateRandomSeq();
        this.mainState.seq++;
        [this.mainState.seq, this.mainState.ack] = [this.mainState.ack, this.mainState.seq];
    }

    clickFirstButton() {
        this.mainState.state = new ClientGetAckAndSyn(this.mainState);
        this.mainState.render();
    }

    clickSecondButton() {
        this.mainState.state = new ClientGetAckAndSyn(this.mainState);
        this.mainState.render();     
    }

    renderAckAndSynButtons() {
        $("#start-state-button").append(`<button type="button" id="send-syn-ack" class="btn btn-success first-button">Send ACK SYN</button>`);
    }
}
// ---------------------------------------------------------------------------------
class ServerRejectSynState {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.renderButtons();
    }

    setParams() {
        this.mainState.signState = "Сервер не принял запрос";
        this.mainState.arrow = "second";
    }


    clickFirstButton() {
        this.mainState.state = new ClientGetRstFlag(this.mainState);
        this.mainState.render();
    }

    clickSecondButton() {
        this.mainState.state = new StartState(this.mainState); 
        this.mainState.render();
    }

    renderButtons() {
        $("#start-state-button").append(`<button type="button" id="send-rst" class="btn btn-success first-button">Send RST</button>`);
        $("#start-state-button").append(`<button type="button" id="wait-nothing" class="btn btn-info second-button">Do nothing</button>`);
    }
}
// ---------------------------------------------------------------------------------
class ClientGetRstFlag {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
    }

    setParams() {
        this.mainState.signState = "Клиент получил RST-флаг, соединение разорвано";
        [this.mainState.srcPort, this.mainState.dstPort] = [this.mainState.dstPort, this.mainState.srcPort];
        this.mainState.cli = ["RST"];
        this.mainState.side = "client";
        this.mainState.changeTable();
    }
}
// ---------------------------------------------------------------------------------
class ClientGetAckAndSyn  {

    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
        this.showButtonSendToServer();
    }

    setParams() {
        this.mainState.seq = this.mainState.seq + 1;
        this.mainState.srcPort = this.mainState.portClient;
        this.mainState.dstPort = this.mainState.portServer;
        this.mainState.arrow = "third";
        this.mainState.signState = "Клиент получил сегмент с ACK и SYN";
        this.mainState.side = "client";
        this.mainState.clientStatus = "SYN-RECEIVED";
        this.mainState.serverStatus = "SEND-SYN";
        this.mainState.cli = ["SYN, ACK"];
        [this.mainState.srcPort, this.mainState.dstPort] = [this.mainState.dstPort, this.mainState.srcPort];
        this.mainState.changeTable();
    }

    clickFirstButton() {
        this.mainState.state = new EstablishedServer(this.mainState);
        this.mainState.render();
    }

    showButtonSendToServer() {
        $("#start-state-button").append(`<button type="button" id="final-state" class="btn btn-info first-button">Send ACK</button>`);
    }
}

// ------------------------------------------------
class EstablishedServer {
    constructor(mainState) {
        this.mainState = mainState;
        this.setParams();
    }

    setParams() {
        this.mainState.signState = "Сервер в состоянии SYN-RECEIVED получил сегмент с флагом ACK. Соединение установлено";
        this.mainState.srcPort = this.mainState.portClient;
        this.mainState.dstPort = this.mainState.portServer;
        this.mainState.cli = ["ACK"];
        this.mainState.arrow = "two-side";
        this.mainState.serverStatus = "Established";
        this.mainState.clientStatus = "Established";
        this.mainState.side = "server";
        [this.mainState.seq, this.mainState.ack] = [this.mainState.ack, this.mainState.seq];
        this.mainState.changeTable();
    }
}   
// -------------------------------------------------------------------
// Logic
let tcp = new Main();

$(document).on ("click", ".first-button",  (e) => {
    tcp.clickFirstButton(e.target);
    console.log(tcp);
});

$(document).on ("click", ".second-button",  (e) => {
    tcp.clickSecondButton(e.target);
    console.log(tcp);
});