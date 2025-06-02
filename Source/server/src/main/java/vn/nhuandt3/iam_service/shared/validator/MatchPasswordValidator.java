package vn.nhuandt3.iam_service.shared.validator;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.nhuandt3.iam_service.application.http.request.user.CreateUserRequest;
import vn.nhuandt3.iam_service.shared.validator.contracts.MatchPassword;

public class MatchPasswordValidator implements ConstraintValidator<MatchPassword, CreateUserRequest> {
    @Override
    public boolean isValid(CreateUserRequest request, ConstraintValidatorContext context) {
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();


        if (password == null || confirmPassword == null) {
            return false;
        }

        if (password.length() < 6 || confirmPassword.length() < 6) {
            return false;
        }

        return request.getPassword().equals(request.getConfirmPassword());
    }
}
