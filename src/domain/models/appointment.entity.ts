import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryColumn()
  appointmentId: string;

  @Column()
  insuredId: string;

  @Column()
  scheduleId: number;

  @Column()
  countryISO: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown>;
}
