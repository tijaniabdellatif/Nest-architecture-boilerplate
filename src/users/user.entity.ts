
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Unique,
} from 'typeorm';


@Entity()
@Unique('email',['email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('New recored inserted with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('New recored updated with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('New recored removed with id', this.id);
  }
}
