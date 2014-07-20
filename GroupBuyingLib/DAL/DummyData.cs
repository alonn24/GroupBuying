using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GroupBuyingLib.Model;
using GroupBuyingLib.Model.OrderLib;
using GroupBuyingLib.Model.ProductLib;

namespace GroupBuyingLib.DAL
{
    public class DummyData
    {
        public static List<User> GetUsersFromDB() {
            User alon = new User("alon", "123-abcd", "User");
            alon.Email = "alonn24@gmail.com";
            alon.Profile = "Default.jpg";
            User admin = new User("admin", "123-abcd", "ProductManager");
            admin.Email = "admin@gmail.com";
            admin.Profile = "Unknown.jpg";
            return new List<User>() { alon, admin };
        }

        public static List<Product> GetProductsFromDB() {
            List<User> users = GetUsersFromDB();
            User alon = users.Where(user => user.UserName == "alon").First();
            User admin = users.Where(user => user.UserName == "admin").First();

            Product product1 = new Product(1, 25000, 50000, 100, admin);
            product1.Image = "hundai.jpg";
            product1.Title = "Hundai";
            Product product2 = new Product(2, 5, 10, 500, admin);
            product2.Image = "ipad.jpg";
            product2.Title = "Ipad";
            Product product3 = new Product(3, 50, 150, 5, admin);
            product3.Image = "massage.jpg";
            product3.Title = "Special message";
            Product product4 = new Product(4, 10, 20, 10, admin);
            product4.Image = "pineapple.jpg";
            product4.Title = "Tasty pineapple";
            Product product5 = new Product(5, 100, 300, 5, alon);
            product5.Image = "watch.jpg";
            product5.Title = "Luxury watch";
            Product product6 = new Product(6, 60000, 80000, 20, alon);
            product6.Image = "wedding.jpg";
            product6.Title = "Wedding";

            return new List<Product>() { product1, product2, product3, product4, product5, product6};
        }
        public static List<Order> GetOrdersFromDB() {
            // users
            List<User> users = GetUsersFromDB();
            User alon = users.Where(user => user.UserName == "alon").First();
            User admin = users.Where(user => user.UserName == "admin").First();

            // products
            List<Product> products = GetProductsFromDB();
            // admin seller
            Product product1 = products[0];
            Product product2 = products[1];
            Product product3 = products[2];
            Product product4 = products[3];
            // alon seller
            Product product5 = products[4];
            Product product6 = products[5];

            // orders
            // alon orders
            Order alonorder1 = new Order(1, alon, product1);
            Order alonorder2 = new Order(2, alon, product2);
            alonorder2.Quantity = 7;
            Order alonorder3 = new Order(3, alon, product3);
            alonorder3.Quantity = 2;
            // admin orders
            Order adminorder1 = new Order(5, admin, product5);
            adminorder1.Quantity = 2;
            return new List<Order>() { alonorder1, alonorder2, alonorder3, adminorder1};
        }
    }
}
