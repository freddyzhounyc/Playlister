/**
 * "Interface" for database connection
 */
class DatabaseManager {

    /**
     * Initialize a connection to the database
     */
    connect() {
        throw new Error("Implement connection!");
    }
    /**
     * Create an object in the database if it does NOT already exist and 
     * updates the object if it already exists. C and U of CRUD.
     */
    async save(collection, saveObject) {
        throw new Error("Implement save!");
    }
    /**
     * Read one object from the database by id
     */
    async readOneById(collection, id) {
        throw new Error("Implement readOneById!");
    }
    /**
     * Read one object from the database
     */
    async readOne(collection, criteria) {
        throw new Error("Implement readOne!");
    }
    /**
     * Read all objects that fit a criteria
     */
    async readAll(collection, criteria) {
        throw new Error("Implement readAll!");
    }
    /**
     * Delete an object from the database by id
     */
    async deleteById(collection, id) {
        throw new Error("Implement deleteById!");
    }
    /**
     * Delete an object from the database
     */
    async delete(collection, criteria) {
        throw new Error("Implement delete!");
    }

}
module.exports = DatabaseManager;