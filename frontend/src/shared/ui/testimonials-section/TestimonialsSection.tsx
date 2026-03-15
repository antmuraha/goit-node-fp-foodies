import { useDataTestimonials } from "../../hooks/useDataTestimonials";

const TestimonialsSection = () => {
  const { testimonials } = useDataTestimonials();

  return (
    <section>
      <h2>Testimonials</h2>
      {testimonials.length === 0 ? (
        <p>No testimonials available.</p>
      ) : (
        <ul>
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <p>{testimonial.content}</p>
              <p>Rating: {testimonial.rating ?? "N/A"}</p>
              <p>By: {testimonial.owner.email}</p>
              <p>Published: {testimonial.isPublished ? "Yes" : "No"}</p>
              <p>Created at: {new Date(testimonial.createdAt).toLocaleDateString()}</p>
              <p>Updated at: {new Date(testimonial.updatedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TestimonialsSection;
