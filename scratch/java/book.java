public class Book extends Searchable implements Readable
{

    //powering search engine of books against title

    //Object Book = new Book()

    private string title;
    //private string author;

   // private arraysLists author;

    public string getTitle()
    {
    return title;
    }

    public string setTitle(string title1)
    {
        title=title1;
    }

    @override
    public string getType()
    {
        return "article"
    }

}

public class Author
{

    private string firstName;
    private string lastName;


}

public class Magazine extends Searchable implements Readable
{
    private string name;
}

public class Searchable
{
    private arraysLists author;


}

public interface Readable
{
    public string getType();


}

