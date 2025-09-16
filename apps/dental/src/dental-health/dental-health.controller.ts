import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DentalHealthController {
  @MessagePattern('health.check')
  async getHealth(@Payload() payload: any) {
    return {
      service: 'ms-dental',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      modules: {
        patient: 'active',
        appointment: 'active',
        inventory: 'active',
        task: 'active',
      },
      version: '1.0.0',
      message_patterns: {
        patient: [
          'patient.create',
          'patient.findAll',
          'patient.findOne',
          'patient.update',
          'patient.remove',
          'patient.updateDentalChart',
          'patient.search',
        ],
        appointment: [
          'appointment.create',
          'appointment.findAll',
          'appointment.findOne',
          'appointment.update',
          'appointment.remove',
          'appointment.findByPatient',
          'appointment.findByDentist',
          'appointment.findByStatus',
          'appointment.findByDateRange',
          'appointment.complete',
          'appointment.search',
        ],
        health: [
          'health.check',
          'health.patient',
          'health.appointment',
        ],
      },
    };
  }

  @MessagePattern('health.patient')
  async getPatientModuleHealth(@Payload() payload: any) {
    return {
      module: 'patient',
      status: 'healthy',
      features: [
        'create_patient',
        'update_patient',
        'delete_patient',
        'search_patients',
        'update_dental_chart',
      ],
      entities: ['DentalPatient'],
      enums: ['GENDER', 'INSURANCE'],
      message_patterns: [
        'patient.create',
        'patient.findAll',
        'patient.findOne',
        'patient.update',
        'patient.remove',
        'patient.updateDentalChart',
        'patient.search',
      ],
    };
  }

  @MessagePattern('health.appointment')
  async getAppointmentModuleHealth(@Payload() payload: any) {
    return {
      module: 'appointment',
      status: 'healthy',
      features: [
        'create_appointment',
        'update_appointment',
        'delete_appointment',
        'search_appointments',
        'complete_appointment',
        'find_by_patient',
        'find_by_dentist',
        'find_by_status',
        'find_by_date_range',
      ],
      entities: ['DentalAppointment'],
      enums: ['DENTAL_APPOINTMENT_STATUS', 'DENTAL_PROCEDURE_TYPE'],
      message_patterns: [
        'appointment.create',
        'appointment.findAll',
        'appointment.findOne',
        'appointment.update',
        'appointment.remove',
        'appointment.findByPatient',
        'appointment.findByDentist',
        'appointment.findByStatus',
        'appointment.findByDateRange',
        'appointment.complete',
        'appointment.search',
      ],
    };
  }
}
