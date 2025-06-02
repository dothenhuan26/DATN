package vn.nhuandt3.iam_service.shared.validator.contracts;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.nhuandt3.iam_service.shared.validator.MatchPasswordValidator;

import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = MatchPasswordValidator.class)
public @interface MatchPassword {
    String message() default "Password and Confirm Password invalid.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
