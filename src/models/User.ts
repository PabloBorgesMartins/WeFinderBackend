import Sequelize, { Model, DataType, VirtualDataType } from 'sequelize';
import bcrypt from 'bcryptjs';


interface UserProps{
  name: string;
  last_name: string;
  nickname: string;
  lanes: string;
  champion_pool: string;
  elo: string;
  cell_phone: number;
  genre: string;
  email: string;
  password: string;
  password_hash: string;
  representative: boolean;
}

class User extends Model {
  static init(sequelize: DataType) {
    super.init(
      {
        name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        nickname: Sequelize.STRING,
        lanes: Sequelize.STRING,
        champion_pool: Sequelize.STRING,
        elo: Sequelize.STRING,
        genre: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        representative: Sequelize.BOOLEAN,
        email: Sequelize.STRING,
        whatsapp: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    // Antes de salvar converter a senha para hash
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    }).catch((error) => {
      console.log(`error -> ${error}`)
    })
    ;
    return this;
  }

  // static associate(models) {
  //   this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  // }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;