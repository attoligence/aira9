const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

if (menuToggle && siteNav) {
  const setMenuState = (isOpen) => {
    siteNav.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "Close" : "Menu";
    document.body.classList.toggle("nav-open", isOpen && window.innerWidth <= 760);
  };

  menuToggle.setAttribute("aria-expanded", "false");
  setMenuState(false);

  menuToggle.addEventListener("click", () => {
    const isOpen = !siteNav.classList.contains("open");
    setMenuState(isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 760) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "Menu";
      document.body.classList.remove("nav-open");
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const showToast = (message) => {
  let toastHost = document.querySelector(".site-toast-host");

  if (!toastHost) {
    toastHost = document.createElement("div");
    toastHost.className = "site-toast-host";
    document.body.appendChild(toastHost);
  }

  const toast = document.createElement("div");
  toast.className = "site-toast";
  toast.textContent = message;
  toastHost.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => toast.remove(), 240);
  }, 2200);
};

const counters = document.querySelectorAll(".counter");
if (counters.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        const target = Number(counter.dataset.target || "0");
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 75));

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = String(target);
            clearInterval(timer);
          } else {
            counter.textContent = String(current);
          }
        }, 24);

        counterObserver.unobserve(counter);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.target || "0";
  });
}

const testimonialWrap = document.getElementById("testimonialSlider");
if (testimonialWrap) {
  const slides = testimonialWrap.querySelectorAll(".testimonial");
  const nextButton = document.getElementById("nextTestimonial");
  const prevButton = document.getElementById("prevTestimonial");
  let index = 0;

  const showSlide = (newIndex) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[newIndex].classList.add("active");
  };

  nextButton?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  prevButton?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000);
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    if (!item) {
      return;
    }

    item.classList.toggle("open");
  });
});

const setupAnimatedForms = () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.classList.add("animated-form");

    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      const updateState = () => {
        const label = field.closest("label");
        if (!label) {
          return;
        }

        label.classList.toggle("has-value", Boolean(field.value));
      };

      field.addEventListener("focus", () => {
        const label = field.closest("label");
        label?.classList.add("is-focused");
      });

      field.addEventListener("blur", () => {
        const label = field.closest("label");
        label?.classList.remove("is-focused");
        updateState();
      });

      field.addEventListener("input", updateState);
      updateState();
    });
  });
};

setupAnimatedForms();

const cleanVisualPlaceholders = () => {
  document
    .querySelectorAll(".media-placeholder, .logo-placeholder, .avatar-placeholder")
    .forEach((placeholder) => {
      const text = placeholder.textContent.trim().toLowerCase();
      const placeholderTexts = [
        "add image manually",
        "add skill development image manually",
        "add academy image manually",
        "add logo",
        "photo",
      ];

      if (placeholderTexts.includes(text)) {
        placeholder.textContent = "";
        placeholder.setAttribute("aria-hidden", "true");
      }
    });
};

cleanVisualPlaceholders();

const setupCouponSystems = () => {
  const coupons = {
    ATTO10: {
      title: "Get 10% OFF",
      discount: 10,
      expiresAt: "2026-12-31T23:59:59",
    },
    ATTO20: {
      title: "Get 20% OFF",
      discount: 20,
      expiresAt: "2026-12-31T23:59:59",
    },
  };

  document.querySelectorAll("[data-copy-code]").forEach((promo) => {
    const code = promo.dataset.copyCode || "";
    const copyButton = promo.querySelector(".coupon-copy-btn");

    copyButton?.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const helper = document.createElement("input");
          helper.value = code;
          document.body.appendChild(helper);
          helper.select();
          document.execCommand("copy");
          helper.remove();
        }

        showToast("Coupon copied!");
      } catch (error) {
        showToast("Unable to copy coupon code");
      }
    });
  });

  document.querySelectorAll("form[data-coupon-system='true']").forEach((form) => {
    const basePrice = Number(form.dataset.basePrice || "0");
    const couponInput = form.querySelector("[data-coupon-input]");
    const applyButton = form.querySelector("[data-coupon-apply]");
    const removeButton = form.querySelector("[data-coupon-remove]");
    const feedback = form.querySelector("[data-coupon-feedback]");
    const appliedWrap = form.querySelector("[data-coupon-applied]");
    const appliedCodeText = form.querySelector("[data-coupon-applied-code]");
    const originalPriceText = form.querySelector("[data-price-original]");
    const discountPriceText = form.querySelector("[data-price-discount]");
    const finalPriceText = form.querySelector("[data-price-final]");
    const appliedCouponInput = form.querySelector("[data-applied-coupon-input]");
    const discountPercentInput = form.querySelector("[data-discount-percent-input]");
    const discountAmountInput = form.querySelector("[data-discount-amount-input]");
    const finalPriceInput = form.querySelector("[data-final-price-input]");
    const formatter = new Intl.NumberFormat("en-IN");
    let appliedCouponCode = "";

    const formatPrice = (amount) => `Rs. ${formatter.format(amount)}`;

    const resetCouponState = () => {
      appliedCouponCode = "";
      if (couponInput) {
        couponInput.value = "";
      }
      if (feedback) {
        feedback.textContent = "";
        feedback.className = "coupon-feedback";
      }
      if (appliedWrap) {
        appliedWrap.hidden = true;
      }
      if (applyButton) {
        applyButton.disabled = false;
      }
      if (appliedCodeText) {
        appliedCodeText.textContent = "";
      }
      if (discountPriceText) {
        discountPriceText.textContent = formatPrice(0);
      }
      if (finalPriceText) {
        finalPriceText.textContent = formatPrice(basePrice);
      }
      if (appliedCouponInput) {
        appliedCouponInput.value = "";
      }
      if (discountPercentInput) {
        discountPercentInput.value = "0";
      }
      if (discountAmountInput) {
        discountAmountInput.value = "0";
      }
      if (finalPriceInput) {
        finalPriceInput.value = String(basePrice);
      }
    };

    if (originalPriceText) {
      originalPriceText.textContent = formatPrice(basePrice);
    }

    resetCouponState();

    couponInput?.addEventListener("input", () => {
      const value = couponInput.value.trim().toUpperCase();
      if (value.startsWith("ATTO") && !appliedCouponCode && feedback) {
        feedback.textContent = "Available coupons: ATTO10, ATTO20";
        feedback.className = "coupon-feedback hint";
      } else if (!appliedCouponCode && feedback) {
        feedback.textContent = "";
        feedback.className = "coupon-feedback";
      }
    });

    applyButton?.addEventListener("click", () => {
      if (!couponInput || appliedCouponCode) {
        return;
      }

      const enteredCode = couponInput.value.trim().toUpperCase();
      const coupon = coupons[enteredCode];

      if (!coupon) {
        if (feedback) {
          feedback.textContent = "Invalid Coupon Code";
          feedback.className = "coupon-feedback error";
        }
        return;
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        if (feedback) {
          feedback.textContent = "This coupon has expired";
          feedback.className = "coupon-feedback error";
        }
        return;
      }

      const discountAmount = Math.round(basePrice * (coupon.discount / 100));
      const finalPrice = basePrice - discountAmount;

      appliedCouponCode = enteredCode;

      if (discountPriceText) {
        discountPriceText.textContent = `- ${formatPrice(discountAmount)}`;
      }
      if (finalPriceText) {
        finalPriceText.textContent = formatPrice(finalPrice);
      }
      if (feedback) {
        feedback.textContent = "Coupon Applied Successfully!";
        feedback.className = "coupon-feedback success";
      }
      if (applyButton) {
        applyButton.disabled = true;
      }
      if (appliedWrap) {
        appliedWrap.hidden = false;
      }
      if (appliedCodeText) {
        appliedCodeText.textContent = `${enteredCode} (${coupon.discount}% OFF)`;
      }
      if (appliedCouponInput) {
        appliedCouponInput.value = enteredCode;
      }
      if (discountPercentInput) {
        discountPercentInput.value = String(coupon.discount);
      }
      if (discountAmountInput) {
        discountAmountInput.value = String(discountAmount);
      }
      if (finalPriceInput) {
        finalPriceInput.value = String(finalPrice);
      }
    });

    removeButton?.addEventListener("click", () => {
      resetCouponState();
      showToast("Coupon removed");
    });
  });
};

setupCouponSystems();

const globalSheetEndpoint =
  window.ATTO_SHEETS_ENDPOINT ||
  "https://script.google.com/macros/s/AKfycbwyx8gxPYXf3_78k9r1MV27PeAFUALZ9VD3AAo0wpm6dH6XyhANvrQfYr4UMYTukZ9Kjg/exec";

const allForms = document.querySelectorAll("form[data-google-sheet='true']");

const getSuccessMessage = (formName) => {
  const messages = {
    "Career Partner Job Application": "Your application has been submitted successfully.",
    "Attoligence Internal Application": "Your application has been submitted successfully.",
    "Training Enrollment": "Your enrollment has been submitted successfully.",
    "Mock Interview Booking": "Your booking has been submitted successfully.",
    "Business Hiring Request": "Your request has been submitted successfully.",
    "Candidate Career Interest Request": "Your details have been submitted successfully.",
    "Business Client Hiring Request": "Your request has been submitted successfully.",
    "Academy College Partnership Request": "Your request has been submitted successfully.",
    "HR Interview Expert Registration": "Your application has been submitted successfully.",
    "Contact Enquiry": "Your enquiry has been submitted successfully.",
  };

  return messages[formName] || "Your form has been submitted successfully.";
};

allForms.forEach((form) => {
  const submitButton = form.querySelector("button[type='submit']");
  const trackedFields = form.querySelectorAll("input, select, textarea");

  const updateSubmitState = () => {
    if (!submitButton) {
      return;
    }

    submitButton.disabled = !form.checkValidity();
  };

  trackedFields.forEach((field) => {
    field.addEventListener("input", updateSubmitState);
    field.addEventListener("change", updateSubmitState);
    field.addEventListener("blur", updateSubmitState);
  });

  updateSubmitState();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const endpoint = form.dataset.endpoint || globalSheetEndpoint;
    const defaultButtonText =
      submitButton?.dataset.defaultText || submitButton?.textContent || "Submit";

    if (!form.checkValidity()) {
      form.reportValidity();
      updateSubmitState();
      return;
    }

    if (!endpoint || endpoint.includes("REPLACE_")) {
      if (status) {
        status.className = "form-status error";
        status.textContent = "Something went wrong. Please try again.";
      }
      return;
    }

    const formData = new FormData(form);
    const payload = {};
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      const normalizedValue =
        key.toLowerCase().includes("resume") && value instanceof File
          ? value.name || "File selected"
          : value;

      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (Array.isArray(payload[key])) {
          payload[key].push(normalizedValue);
        } else {
          payload[key] = [payload[key], normalizedValue];
        }
      } else {
        payload[key] = normalizedValue;
      }

      if (Array.isArray(normalizedValue)) {
        normalizedValue.forEach((item) => params.append(key, item));
      } else {
        params.append(key, normalizedValue);
      }
    });

    payload.submittedAt = new Date().toISOString();
    payload.page = window.location.pathname;
    payload.formName = form.dataset.formName || "Attoligence Form";
    params.append("submittedAt", payload.submittedAt);
    params.append("page", payload.page);
    params.append("formName", payload.formName);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Please wait";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      let responseData = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          responseData = null;
        }
      }

      if (responseData && responseData.status === "error") {
        throw new Error(responseData.message || "Submission failed");
      }

      if (status) {
        status.className = "form-status success";
        status.textContent = getSuccessMessage(payload.formName);
      }
      form.reset();
      form.querySelectorAll("label").forEach((label) => {
        label.classList.remove("has-value", "is-focused");
      });
      updateSubmitState();
    } catch (error) {
      if (status) {
        status.className = "form-status error";
        status.textContent = "Something went wrong. Please try again.";
      }
    } finally {
      if (submitButton) {
        submitButton.classList.remove("is-loading");
        submitButton.removeAttribute("aria-busy");
        submitButton.textContent = defaultButtonText;
        updateSubmitState();
      }
    }
  });
});

const injectAiraAssistant = () => {
  if (document.querySelector(".aira-widget")) {
    return;
  }

  const tipsByPage = {
    "/index.html": {
      title: "AIRA",
      message: "Need a quick start? I can guide you to jobs, hiring support, training, or mock interviews.",
      actions: [
        { label: "Explore Careers", href: "career.html" },
        { label: "Hire Talent", href: "attoligence-business.html" },
        { label: "View Courses", href: "training.html" },
      ],
    },
    "/career.html": {
      title: "AIRA",
      message: "Looking for the right opening? Review partner jobs or apply for Attoligence internal roles.",
      actions: [
        { label: "Partner Jobs", href: "#partner-jobs" },
        { label: "Attoligence Roles", href: "attoligence-careers.html" },
        { label: "Career Form", href: "candidate-interest-form.html" },
      ],
    },
    "/attoligence-business.html": {
      title: "AIRA",
      message: "I can help your team move faster with hiring requests, consultation support, and business solutions.",
      actions: [
        { label: "Request Hiring", href: "business-client-form.html" },
        { label: "Talk to Team", href: "contact-enquiry.html" },
        { label: "Business Page", href: "#solutions" },
      ],
    },
    "/training.html": {
      title: "AIRA",
      message: "Want to enroll faster? Check the current course, apply a coupon, or open the enrollment form.",
      actions: [
        { label: "Leading Courses", href: "#leading-courses" },
        { label: "Enroll Now", href: "training-enrollment.html" },
        { label: "Mock Interview", href: "mock-interview-booking.html" },
      ],
    },
    "/mock-interview.html": {
      title: "AIRA",
      message: "Prepare with confidence. I can take you to booking, interview guides, or expert registration.",
      actions: [
        { label: "Book Interview", href: "mock-interview-booking.html" },
        { label: "View Guide", href: "downloads/master-interview-handbook.html" },
        { label: "Become Expert", href: "hr-expert-registration.html" },
      ],
    },
    "/contact.html": {
      title: "AIRA",
      message: "Need help quickly? Use the enquiry form, call the team, or start a WhatsApp chat.",
      actions: [
        { label: "Send Enquiry", href: "contact-enquiry.html" },
        { label: "Call Now", href: "tel:+918897590194" },
        { label: "WhatsApp", href: "https://wa.me/918897590194" },
      ],
    },
  };

  const pageConfig =
    tipsByPage[window.location.pathname] ||
    tipsByPage[window.location.pathname.replace(/\/$/, "/index.html")] || {
      title: "AIRA",
      message: "I can help you find the next best step across careers, business support, training, and interview preparation.",
      actions: [
        { label: "Home", href: "index.html" },
        { label: "Careers", href: "career.html" },
        { label: "Contact", href: "contact.html" },
      ],
    };

  const widget = document.createElement("section");
  widget.className = "aira-widget";
  widget.innerHTML = `
    <div class="aira-badge" aria-hidden="true">Hi, I'm AIRA</div>
    <button class="aira-toggle" type="button" aria-expanded="false" aria-controls="airaPanel" aria-label="Open AIRA assistant">
      <span class="aira-robot" aria-hidden="true">
        <span class="aira-eye aira-eye-left"></span>
        <span class="aira-eye aira-eye-right"></span>
        <span class="aira-mouth"></span>
      </span>
      <span class="aira-toggle-text">
        <strong>${pageConfig.title}</strong>
        <small>Your Attoligence Assistant</small>
      </span>
    </button>
    <div class="aira-panel" id="airaPanel" hidden>
      <div class="aira-panel-head">
        <div>
          <p class="aira-kicker">AI-powered support</p>
          <h3>${pageConfig.title}</h3>
        </div>
        <button class="aira-close" type="button" aria-label="Close AIRA assistant">Close</button>
      </div>
      <p class="aira-message">${pageConfig.message}</p>
      <div class="aira-actions">
        ${pageConfig.actions
          .map(
            (action) =>
              `<a class="aira-action" href="${action.href}"${
                action.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""
              }>${action.label}</a>`
          )
          .join("")}
      </div>
      <div class="aira-utility-actions">
        <a class="aira-utility-link" href="https://wa.me/918897590194" target="_blank" rel="noopener">WhatsApp</a>
        <a class="aira-utility-link" href="tel:+918897590194">Call</a>
        <a class="aira-utility-link" href="#top" data-aira-top="true">Back to Top</a>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const toggle = widget.querySelector(".aira-toggle");
  const panel = widget.querySelector(".aira-panel");
  const close = widget.querySelector(".aira-close");

  const setAiraState = (isOpen) => {
    panel.hidden = !isOpen;
    widget.classList.toggle("open", isOpen);
    toggle?.setAttribute("aria-expanded", String(isOpen));
  };

  toggle?.addEventListener("click", () => {
    setAiraState(!widget.classList.contains("open"));
  });

  close?.addEventListener("click", () => {
    setAiraState(false);
  });

  widget.querySelector("[data-aira-top='true']")?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAiraState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setAiraState(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!widget.contains(event.target)) {
      setAiraState(false);
    }
  });
};

injectAiraAssistant();


