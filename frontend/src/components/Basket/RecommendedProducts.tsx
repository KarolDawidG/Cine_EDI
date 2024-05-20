import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { VHS } from "../Vhs/interfaces/VhsInterface";

const RecommendedProducts: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const exampleRecommendations: any[] = [
        {
            id: "1",
            title: "Inception",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
            img_url: "/aSY6QhgEeUYky0TMfAXjvRJj5bL.jpg",
            genre: "Science Fiction",
            price_per_day: 5,
            quantity_available: 10,
            due_date: "",
            account_id: null,
            status: ""
        },
        {
            id: "2",
            title: "Interstellar",
            description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            img_url: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            genre: "Science Fiction",
            price_per_day: 5,
            quantity_available: 10,
            due_date: "",
            account_id: null,
            status: ""
        },
        {
            id: "3",
            title: "The Matrix",
            description: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
            img_url: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            genre: "Science Fiction",
            price_per_day: 5,
            quantity_available: 10,
            due_date: "",
            account_id: null,
            status: ""
        },
        {
            id: "4",
            title: "Blade Runner 2049",
            description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
            img_url: "/g3YrbSqzRXVEM74AaY8rK5OqY9u.jpg",
            genre: "Science Fiction",
            price_per_day: 5,
            quantity_available: 10,
            due_date: "",
            account_id: null,
            status: ""
        },
        {
            id: "5",
            title: "Guardians of the Galaxy",
            description: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
            img_url: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
            genre: "Science Fiction",
            price_per_day: 5,
            quantity_available: 10,
            due_date: "",
            account_id: null,
            status: ""
        },
        {
            id: "6",
            title: "Avatar",
            description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
            img_url: "/6DfNtptjkIrevq4mDAB0XDXT0NO.jpg",
            genre: "Science Fiction",
            price_per_day: 5,
            quantity_available: 10,
            due_date: "",
            account_id: null,
            status: ""
        }
    ];

    useEffect(() => {
        // Symulacja pobierania danych i filtracji
        setIsLoading(false);
    }, []);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Rekomendacje dla ciebie
            </Typography>

            <Box sx={{ display: 'flex', overflowX: 'scroll', gap: 2 }}>
                {exampleRecommendations.map((recommended) => (
                    <Card key={recommended.id} sx={{ minWidth: 200 }}>
                        <CardMedia
                            component="img"
                            sx={{ height: 300, objectFit: 'cover' }}
                            image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${recommended.img_url}`}
                            alt={recommended.title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {recommended.title}
                            </Typography>
                        </CardContent>
                        <Button size="small" color="primary">
                            Add to Cart
                        </Button>
                    </Card>
                ))}
            </Box>
        </Box>
        
    );
};

export default RecommendedProducts;
