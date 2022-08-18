from locust import HttpUser, task
from faker import Faker
import random
import json

fake = Faker(['tr_TR'])


class UserBehavior(HttpUser):
    @task
    def time(self):
        # sunucu saati
        self.client.get("time")

    @task
    def paragraph(self):
        # Backend'den lorem ipsum kütüphanesi ile 1000 paragraf'lık metin dönüyor
        self.client.get("paragraph")

    @task
    def register(self):
        # "".join(random.choice(["?", "#"]) for i in range(random.randint(5, 10)))
        # 5 ile 10 karakter arasi "#" ve "?" karakterlerinden olusan string uret
        # daha sonra faker ile içini doldur
        self.client.post("users/register",
                         json={
                             "name": fake.name(),
                             "username": fake.bothify(
                                 text="".join(random.choice(["?", "#"]) for i in range(random.randint(5, 10)))),
                             "password": fake.bothify(
                                 text="".join(random.choice(["?", "#"]) for i in range(random.randint(5, 10))))})

    @task
    def profile(self):
        response = self.client.post("users/login", json={"username": "test123", "password": "test123"})
        response = json.loads(response.content)
        token = response["token"]
        self.client.get("users/profile", headers={"Authorization": token})

    @task
    def login(self):
        self.client.post("users/login", json={"username": "test_username", "password": "test_password"})

    @task
    def logout(self):
        # once login olarak jwt token al
        # logout authorization istedigi icin header a ekle
        response = self.client.post("users/login", json={"username": "test2", "password": "test2"})
        response = json.loads(response.content)
        token = response["token"]
        self.client.post("users/logout", headers={"Authorization": token})

    @task
    def logout_all(self):
        # Tüm cihazlardan cikis yapmak icin
        response = self.client.post("users/login", json={"username": "test1", "password": "test1"})
        response = json.loads(response.content)
        token = response["token"]
        self.client.post("users/logoutall", headers={"Authorization": token})

