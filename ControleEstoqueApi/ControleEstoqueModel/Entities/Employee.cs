using System;

namespace ControleEstoqueModel.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public string? PhotoPath { get; set; }

        public Employee()
        {
        }

        public Employee(string name, int age, string? photoPath)
        {
            Name = name;
            Age = age;
            PhotoPath = photoPath;
        }
    }
}
