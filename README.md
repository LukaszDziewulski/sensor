# **Sensor Data Project**

## **Environment Configuration**

To run the application, you need to configure the `.env` file with the required environment variables. Example:

```env
MONGO_URI=mongodb://localhost:27018/mydatabase
```

## **Running MongoDB in a Docker Container**

Follow these steps to run MongoDB in a Docker container:

1. **Pull the latest MongoDB image from Docker Hub:**

   ```bash
   docker pull mongo
   ```

2. **Start the MongoDB container:**

   ```bash
   docker run --name mymongodb -d -p 27018:27017 mongo:latest
   ```

3. **Verify that the container is running:**

   ```bash
   docker container ls
   ```

## **Running the Application**

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the application server:**

   ```bash
   nx serve sensor
   ```

3. The application will be available at: [http://localhost:3333/api](http://localhost:3333/api)

## **WebSocket**

To send data to the WebSocket, connect to `ws://localhost:3333` and send the following message:

```json
{
  "event": "sensor_data",
  "data": {
    "temperature": 255,
    "humidity": 60
  }
}
```

**Response on successful data submission:**

```json
{
  "event": "sensor_data_added",
  "data": {
    "message": "Sensor data added successfully",
    "receivedData": {
      "temperature": 255,
      "humidity": 60
    }
  }
}
```

**Response in case of validation errors:**

```json
{
  "event": "sensor_data_error",
  "data": {
    "message": "Invalid data received",
    "errors": [
      /* list of validation errors */
    ]
  }
}
```

## **Running Tests**

To run the tests, execute the following command:

```bash
npx jest
```

## **Swagger API Documentation**

The application automatically generates API documentation using Swagger. The documentation is available at:

[http://localhost:3333/api](http://localhost:3333/api)

### **API Endpoints**

- **Add Sensor Data**

  - **POST** `api/sensors`
  - **Body:** `AddSensorDataDto`

    - **Fields:**

      - **temperature** (`number`, required)

        - **Description:** Temperature of the sensor data.
        - **Validation:**
          - Must be a number.
          - Minimum value: `-100`.
          - Maximum value: `1000`.
          - Cannot be empty.
        - **Example:** `25`

      - **humidity** (`number`, required)
        - **Description:** Humidity level of the sensor data.
        - **Validation:**
          - Must be a number.
          - Minimum value: `0`.
          - Maximum value: `100`.
          - Cannot be empty.
        - **Example:** `60`

  - **Response:** `SensorDataResponseDto`

    - **Fields:**

      - **id** (`string`)

        - **Description:** Unique identifier for the sensor data.
        - **Example:** `25`

      - **temperature** (`number`)

        - **Description:** Temperature of the sensor data.
        - **Example:** `25`

      - **humidity** (`number`)

        - **Description:** Humidity level of the sensor data.
        - **Example:** `60`

      - **createdAt** (`string`, auto-generated)
        - **Description:** Timestamp of when the sensor data was created.
        - **Example:** `2021-01-01T00:00:00Z`

- **Get Sensor Data by ID**

  - **GET** `api/sensors/:sensorDataId`
  - **Response:** `SensorDataResponseDto`
    - **Fields:** (as described in the response of Add Sensor Data)

- **Get All Sensor Data**

  - **GET** `api/sensors`
  - **Response:** `SensorDataResponseDto[]`
    - **Fields:** (as described in the response of Add Sensor Data)

- **Update Sensor Data by ID**

  - **PATCH** `api/sensors/:sensorDataId`
  - **Body:** `UpdateSensorDataDto`

    - **Fields:**

      - **temperature** (`number`, optional)

        - **Description:** Updated temperature of the sensor data.
        - **Validation:**
          - Must be a number.
          - Minimum value: `-100`.
          - Maximum value: `1000`.
        - **Example:** `25`

      - **humidity** (`number`, optional)
        - **Description:** Updated humidity level of the sensor data.
        - **Validation:**
          - Must be a number.
          - Minimum value: `0`.
          - Maximum value: `100`.
        - **Example:** `60`

  - **Response:** `SensorDataResponseDto`
    - **Fields:** (as described in the response of Add Sensor Data)

- **Delete Sensor Data by ID**

  - **DELETE** `api/sensors/:sensorDataId`
  - **Response:** No Content (204)
