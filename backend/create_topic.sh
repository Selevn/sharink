#/bin/bash

/opt/bitnami/kafka/bin/kafka-topics.sh --create --topic $TEST_TOPIC_NAME --bootstrap-server kafka:9092
echo "topic $TEST_TOPIC_NAME was create"