import Sequelize, { Model, DataType } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize: DataType) {
    super.init(
      {
        name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        nick_name: Sequelize.STRING,
        lanes: Sequelize.STRING,
        champion_pool: Sequelize.STRING,
        elo: Sequelize.STRING,
        date_birth: Sequelize.STRING,
        cell_phone: Sequelize.INTEGER,
        genre: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        representative: Sequelize.BOOLEAN,
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
    });
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