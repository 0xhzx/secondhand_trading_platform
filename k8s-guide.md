# k8s setup process

## 1. Build Docker images

### server
```bash
cd server
docker build -t 0xhzx/cs590-final-server:latest .
docker push 0xhzx/cs590-final-server:latest # set is as your own docker hub
cd ..
```

### UI (with NGINX)
```bash
cd frontend
docker build -t 0xhzx/cs590-final-ui:latest .
docker push 0xhzx/cs590-final-ui:latest
cd ..
```

Our MongoDB is hosted on MongoDB Atlas, so we don't need to build a Docker image for it.

## 2. Deploy on Kubernetes

```bash
kubectl create -f k8s/
```

## Undeploy

Undeploy before re-deploying if you make a change to the app. Also remember to rebuild Docker images per the instructions earlier in this README.

```bash
kubectl delete -f k8s/
```


## Alternative way: 
use the commands below to apply each manifest separately, which gives you more control over each deployment and can be helpful for debugging purposes.

```bash
kubectl apply -f server-deployment.yaml
kubectl apply -f server-service.yaml
kubectl apply -f ui-deployment.yaml
kubectl apply -f ui-service.yaml
```

## Undeploy

Undeploy before re-deploying if you make a change to the app. Also remember to rebuild Docker images.

```bash
kubectl delete -f k8s/
```

## Useful commands

1. Check the status of all pods:

   ```bash
   kubectl get all
   ```
This is the output of the Kubernetes cluster status, displaying the status of Pods, Services, Deployments, and ReplicaSets in the cluster.

Pods: A Pod is the smallest deployable unit in Kubernetes, and it contains one or more containers. In this example, there are three Pods: db-5d65b69df-qncv4, server-dd584d689-fx7x2, and ui-bbdfffdc6-bznff, all of which are in the Running state.

Services: A Service is an abstraction that defines a policy for accessing a group of Pods that provide the same functionality. In this example, there are three Services: db, server, and ui. db and server are of type ClusterIP, which can only be accessed within the cluster, while ui is of type NodePort, allowing access from outside the cluster.

Deployments: A Deployment is a higher-level concept that manages a group of ReplicaSets based on Pod templates, enabling declarative application updates and rollbacks. In this example, there are three Deployments: db, server, and ui, each with one replica.

ReplicaSets: A ReplicaSet is a controller that ensures a specified number of Pod replicas are always running. In this example, there are three ReplicaSets: db-5d65b69df, server-dd584d689, and ui-bbdfffdc6, each with one replica.

This output shows the current status of the Kubernetes cluster, including the names, statuses, restart counts, ages, and other information for each resource.

2. Check the status of your services:

   ```bash
   kubectl get services
   ```

   Ensure that the ui and server services are created and have the correct port mappings. 

3. Check the logs of your pod:

   ```bash
   kubectl logs <pod-name>
   ```

   Replace `<pod-name>` with the actual name.