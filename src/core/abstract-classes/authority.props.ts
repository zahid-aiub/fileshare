import { Column } from 'typeorm';

/**
 * Extendable entity dates for all entities.
 *
 * @author Md. Shahariar Hossen
 * @since 6th March 2022
 */
export abstract class AuthorityProps {
  @Column()
  createdBy: number;

  @Column({ default: 0 })
  updatedBy: number;

  @Column({ default: 0 })
  deletedBy: number;
}
