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

class StartState {
    constructor() {
        this.signState = "Начальное состояние, подготовка к соединению, создание исходного порта для связи с известным удаленным портом";
        this.ipClient = "172.19.4.82";
        this.portClient = "54822";
        this.ipServer = "195.19.137.68";
        this.portServer = "110";        
        clearArea();
        this.init();        
    }

    init() {
        this.changeIP();
        this.changeStatusSign();
        this.addButtons();
        this.showSide();
        this.showArrow();
    }

    changeIP() {        
        $("#clientId").text(`${this.ipClient}:${this.portClient}`);
        $("#serverId").text(`${this.ipServer}:${this.portServer}`);
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    addButtons() {
        $("#start-state-button").append(`<button type="button" id="send-first-flag-button" class="btn btn-primary">Send SYN</button>`);
    }

    showSide() {
        $(".client-sign").css("border-bottom", "4px solid green");	
    }

    showArrow() {
        $(".arrow-first").css("opacity", "1");
    }
}

// ---------------------------------------------------------------------------------

class SendFirstFlags {
    constructor(seq, portClient, portServer) {
        this.signState = "Клиент выполнил запрос на создание TCP-сессии. Отправлен SYN-запроc)";
        this.seq = seq;
        this.srcPort = portClient;
        this.dstPort = portServer;
        this.cli = ["SYN"];
        clearArea();
        this.init();
    }

    init() {
        this.changeStatusSign();
        // this.addButtons();
        this.showSide();
        this.changeTable();
        this.showAcceptButton();
        this.showSide();
        this.showRejectConnectionButton();
        this.changeServerStatus();
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    showArrow() {
        $(".arrow-first").css("opacity", "1");
    }

    changeTable() {
        $(".table-seq").text(`${this.seq}`);
        $(".table-src-port").text(`${this.srcPort}`);
        $(".table-dst-port").text(`${this.dstPort}`);
        $(".table-cli").text(`${this.cli.join(', ')}`);
    }

    showRejectConnectionButton() {
        $("#start-state-button").append(`<button type="button" id="reject-syn-server" class="btn btn-danger">Reject</button>`);
    }

    showAcceptButton() {
        $("#start-state-button").append(`<button type="button" id="received-syn-server" class="btn btn-success">Accept</button>`);
    }    

    showSide() {
        $(".server-sign").css("border-bottom", "4px solid green");	
    }

    changeServerStatus() {
        $(".client-sign h6").text(`SEND-SYN`);
    }
}

// ---------------------------------------------------------------------------------

class ServerReceived {
    constructor() {
        this.signState = "Сервер получил сегмент, запомнил номер последовательности и создал сокет для обслуживания нового клиента.";
        clearArea();
        this.init();
    }

    init() {
        this.changeStatusSign();
        this.showSendPocketsToClientWithAckAndSyn();
        this.showSide();
        this.changeServerStatus();
        this.showArrow();
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    showSendPocketsToClientWithAckAndSyn() {
        $("#start-state-button").append(`<button type="button" id="send-syn-ack" class="btn btn-success">Send ACK SYN</button>`);
    } 
    
    showSide() {
        $(".server-sign").css("border-bottom", "4px solid green");	
    }

    changeServerStatus() {
        $(".server-sign h6").text(`SYN-RECEIVED`);
    }

    showArrow() {
        $(".arrow-second").css("opacity", "1");
    }

}

// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------
class ServerRejectSynState {
    constructor() {
        this.signState = "Сервер не принял запрос";
        clearArea();
        this.init();
    }

    init() {
        // this.changeTable();
        this.showButtonSendRst();
        this.changeStatusSign();
        this.showArrow();
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    showButtonSendRst() {
        $("#start-state-button").append(`<button type="button" id="send-rst" class="btn btn-success">Send RST</button>`);
        $("#start-state-button").append(`<button type="button" id="wait-nothing" class="btn btn-info">Do nothing</button>`);
    }

    showArrow() {
        $(".arrow-second").css("opacity", "1");
    }

}

// ---------------------------------------------------------------------------------

class ClientGetRstFlag {
    constructor(seq, portClient, portServer) {
        this.signState = "Клиент получил RST-флаг, соединение разорвано";
        this.seq = seq;
        this.srcPort = portClient;
        this.dstPort = portServer;
        this.cli = ["RST"];
        clearArea();
        this.init();
    }

    init() {
        this.changeTable();
        this.changeStatusSign();
    }

    changeTable() {
        $(".table-seq").text(`${this.seq}`);
        $(".table-src-port").text(`${this.dstPort}`);
        $(".table-dst-port").text(`${this.srcPort}`);
        $(".table-cli").text(`${this.cli.join(', ')}`);
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

}

// ---------------------------------------------------------------------------------

class ClientGetAckAndSyn  {
    constructor(seq, portClient, portServer, ack) {
        this.signState = "Клиент получил сегмент с ACK и SYN";
        this.seq = seq + 1;
        this.ack = ack;
        this.srcPort = portClient;
        this.dstPort = portServer;
        this.cli = ["ACK, SYN"];
        clearArea();
        this.init();
    }

    init() {
        this.changeTable();
        this.changeStatusSign();
        this.showArrow();  
        this.showButtonSendToServer();    
        this.changeServerStatus();
        this.showSide();  
        this.chageClientStatus();
    }

    changeTable() {
        $(".table-seq").text(`${this.ack}`);
        $(".table-ack").text(`${this.seq}`);
        $(".table-src-port").text(`${this.dstPort}`);
        $(".table-dst-port").text(`${this.srcPort}`);
        $(".table-cli").text(`${this.cli.join(', ')}`);
    }

    showArrow() {
        $(".arrow-third").css("opacity", "1");
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    showButtonSendToServer() {
        $("#start-state-button").append(`<button type="button" id="final-state" class="btn btn-info">Send ACK</button>`);
    }

    showSide() {
        $(".client-sign").css("border-bottom", "4px solid green");	
    }

    changeServerStatus() {
        $(".server-sign h6").text(`SEND-SYN`);
    }

    chageClientStatus() {
        $(".client-sign h6").text(`SYN-RECEIVED`);
    }
}

// =-----------------------------------------------

class EstablishedServer{
    constructor(seq, portClient, portServer, ack) {
        this.signState = "Сервер в состоянии SYN-RECEIVED получил сегмент с флагом ACK. Соединение установлено";
        this.seq = seq + 1;
        this.ack = ack + 1;
        this.srcPort = portClient;
        this.dstPort = portServer;
        this.cli = ["ACK"];
        clearArea();
        this.init();
    }

    init() {
        // this.changeTable();
        this.changeStatusSign();
        this.showArrow();  
        this.changeTable();
        this.changeServerStatus();
        this.chageClientStatus();
    }

    changeTable() {
        $(".table-seq").text(`${this.seq}`);
        $(".table-ack").text(`${this.ack}`);
        $(".table-src-port").text(`${this.dstPort}`);
        $(".table-dst-port").text(`${this.srcPort}`);
        $(".table-cli").text(`${this.cli.join(', ')}`);
    }

    showArrow() {
        $(".arrow-two-side").css("opacity", "1");
    }

    changeStatusSign() {
        $("#status-signs").append(`<h5 class="state-sign">${this.signState}</h5>`);
    }

    changeServerStatus() {
        $(".server-sign h6").text(`Established`);
    }

    chageClientStatus() {
        $(".client-sign h6").text(`Established`);
    }
}



let portClient = 54822;
let portServer = 110;
let seq = generateRandomSeq();
let ack = generateRandomSeq();

let state = new StartState();

// Нажили на кнопку отправить флаги
$(document).on ("click", "#send-first-flag-button",  () => {
    state = new SendFirstFlags(seq, portClient, portServer);
});

$(document).on ("click", "#received-syn-server", () => {
    state = new ServerReceived();
});

$(document).on ("click", "#reject-syn-server", () => {
    state = new ServerRejectSynState();
});

$(document).on ("click", "#send-rst", () => {
    state = new ClientGetRstFlag(seq, portClient, portServer);
});

$(document).on ("click", "#wait-nothing", () => {
    state = new StartState(seq, portClient, portServer);
});

$(document).on ("click", "#send-syn-ack", () => {
    state = new ClientGetAckAndSyn(seq, portClient, portServer, ack);
});

$(document).on ("click", "#final-state", () => {
    state = new EstablishedServer(seq, portClient, portServer, ack);
});


// 

// $("#received-syn-server").on('click', function() {
//     alert(1);
// });