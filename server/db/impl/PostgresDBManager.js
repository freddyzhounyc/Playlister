const DatabaseManager = require('../index');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + "/../../../.env"
});

class PostgreSQLManager extends DatabaseManager {

    connect() {
        const sequelize = new Sequelize(process.env.POSTGRES_DB_CONNECT);
        return null;
    }
    async save(collection, saveObject) {
        if (saveObject.id) {
            // update directly in DB
            const [rowsUpdated, [updatedObject]] = await collection.update(
                saveObject,
                {
                    where: { id: saveObject.id },
                    returning: true // returns updated row(s)
                }
            );
            return updatedObject;
        } else {
            return await collection.create(saveObject, { returning: true });
        }
    }
    async readOneById(collection, id) {
        return await collection.findOne({
            where: {
                id: id
            }
        });
    }
    async readOne(collection, criteria) {
        return await collection.findOne({
            where: criteria
        });
    }
    async readAll(collection, criteria) {
        return await collection.findAll({
            where: criteria
        });
    }
    async deleteById(collection, id) {
        let toDelete = await collection.findOne({
            where: {
                id: id
            }
        });
        return await toDelete.destroy();
    }
    async delete(collection, criteria) {
        let toDelete = await collection.findOne({
            where: criteria
        });
        return await toDelete.destroy();
    }

}

module.exports = PostgreSQLManager;