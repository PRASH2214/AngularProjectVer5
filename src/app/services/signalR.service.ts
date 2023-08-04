import { ElementRef, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, HttpTransportType, JsonHubProtocol } from '@aspnet/signalr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { globalx } from './globals.service';
import { MasterService } from './master';

@Injectable()
export class SignalRService {
    connectionEstablished = new EventEmitter<Boolean>();
    signalRUrl = "";
    private connectionIsEstablished = false;
    private _hubConnection: HubConnection;

    constructor(private GlobalsX: globalx, public master: MasterService, private nav: Router,
        private spinner: NgxSpinnerService) {
        this.signalRUrl = environment.signalRUrl;

    }


    public createConnection() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(this.signalRUrl + "chathub", {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

    }

    public startConnection(userid, username): void {

        this._hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
                this.UserJoin(userid, username);
            })
            .catch(err => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(function () { this.startConnection(); }, 5000);
            });
    }

    UserJoin(userid, username) {
        this._hubConnection.invoke('UserJoin', userid, username);
    }

    public registerOnServerEvents(): void {
        this._hubConnection.on('MessageReceivedByPatient', (data: any) => {

            this.GlobalsX.messagerecievedbypatient(data);

        });

        this._hubConnection.on('MessageReceivedByDoctor', (data: any) => {
            this.GlobalsX.messagerecievedbydoctor(data);

        });

        this._hubConnection.on('testconnection', (data: any) => {



        });

        this._hubConnection.on('CallInitiated', (data: any) => {
            this.master.doctorConnectionId = data.fromId;
            this.master.patientConnectionId = data.toId;
            this.master.teleConsultationId = data.message;
            this.GlobalsX.callrequest(data);

        });

        this._hubConnection.on('MRCallInitiated', (data: any) => {
            this.master.doctorConnectionId = data.fromId;
            this.master.patientConnectionId = data.toId;
            this.master.teleConsultationId = data.message;
            this.GlobalsX.MRcallrequest(data);

        });

        this._hubConnection.on('CallDenied', (data: any) => {
            this.GlobalsX.calldenied(true);

            this.master.doctorConnectionId = data.fromId;
            this.master.patientConnectionId = data.toId;
            Swal.fire(
                {
                    title: 'Call Denied!',
                    text: 'Your call is denied.',
                    type: 'success',
                    timer: 3000,
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false
                }
            ).then((result) => {

                this.GlobalsX.calldenied(false);

            })

        });



        this._hubConnection.on('MRCallAccepted', (data: any) => {

            this.spinner.hide();
            this.master.doctorConnectionId = data.toId;
            this.master.patientConnectionId = data.fromId;
            Swal.fire({
                title: "Call Accepted!",
                text: "Your call is Accepted.",
                type: "success",
                timer: 3000,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            this.nav.navigateByUrl('/doctor/mrconsultation');
        });

        this._hubConnection.on('CallAccepted', (data: any) => {

            this.spinner.hide();
            this.master.doctorConnectionId = data.toId;
            this.master.patientConnectionId = data.fromId;
            Swal.fire({
                title: "Call Accepted!",
                text: "Your call is Accepted.",
                type: "success",
                timer: 3000,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            this.nav.navigateByUrl('/doctor/consultation');
        });

        this._hubConnection.on('NotAvailable', (data: any) => {

            this.master.doctorConnectionId = data.fromId;
            this.master.patientConnectionId = data.toId;
            Swal.fire(
                'Not Available!',
                'User not available.',
                'success'
            )

        });

        this._hubConnection.on('ConsultationComplete', (data: any) => {

            this.master.doctorConnectionId = data.fromId;
            this.master.patientConnectionId = data.toId;
            Swal.fire(
                'Appointment Completed!',
                'Completed.',
                'success'
            )
            this.nav.navigateByUrl('/patient/appointments');
        });
        this._hubConnection.on('MRConsultationComplete', (data: any) => {

            this.master.doctorConnectionId = data.fromId;
            this.master.patientConnectionId = data.toId;
            Swal.fire(
                'Appointment Completed!',
                'Completed.',
                'success'
            )
            this.nav.navigateByUrl('/mr/appointmentlist');
        });

    }






}  